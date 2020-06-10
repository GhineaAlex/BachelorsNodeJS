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
    console.log("am ajuns la render");
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.show();

    web3.eth.getAccounts(function(error, accounts){
      console.log(error);
      console.log("contractele sunt" + accounts[0]);
      $("#accountAddress").html("Your Account: " + accounts[0]);
    });

    App.contracts.Election.deployed().then(function(instance){
      electionInstance = instance;
      return electionInstance.candidatesCount();
      //tine evidenta tuturor candidatilor din contract mapat (.sol)
    }).then(function(candidatesCount){
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++){
        electionInstance.candidates(i).then(function(candidate){
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);

          var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      
      loader.hide();
      console.log("test 1");
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castDiploma: function(){
    var 
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
