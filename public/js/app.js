App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function() {
    // Load pets.
    console.log("a fost init contract");
    return App.initWeb3();
  },

  initWeb3: async function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    console.log(1);
    $.getJSON("../build/contracts/Election.json", function(election){
      
      console.log(2);
      //generarea unui contract truffle din artifact
      App.contracts.Election = TruffleContract(election);
      //conectarea la un provider pentru a interacta cu contractul
      App.contracts.Election.setProvider(App.web3Provider);
      
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
      //folosim un json pentru a incarca smart contract-ul, 
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance){
      //solidity ofera posibilitatea de a pasa unui eveniment, filtre ca arugmente intre {}
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        console.log("event triggered", event)
        App.render();
      });
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  render: function(){
   
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(async function(instance) {
      // console.log(candidateId);
      // console.log(App.account);
      // console.log(web3.eth.getAccounts());
      // console.log(x);

      return instance.vote(candidateId, { from: App.accounts });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").show();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
