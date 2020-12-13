App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
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
    $.getJSON("/build/contracts/DiplomaStore.json", function(diplomaStore){
      //generarea unui contract truffle din artifact
      App.contracts.DiplomaStore = TruffleContract(diplomaStore);
      //conectarea la un provider pentru a interacta cu contractul
      App.contracts.DiplomaStore.setProvider(App.web3Provider);
      
      App.contracts.DiplomaStore.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
      //folosim un json pentru a incarca smart contract-ul, 
    });
  },
  listenForEvents: function() {
    App.contracts.DiplomaStore.deployed().then(function(instance){
      //solidity ofera posibilitatea de a pasa unui eveniment, filtre ca arugmente intre {}
      instance.logDiplomaAdded({}, {
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
    var diplomaInstance;

    web3.eth.getAccounts(function(error, accounts){
      console.log(error);
      console.log("contractele sunt" + accounts[0]);
      $("#accountAddress").html("Your Account: " + accounts[0]);
    });
  },
  castDiploma: function(e){
      e.preventDefault();
      let form = document.querySelector("#fmDiploma");
      let url = form.getAttribute('action');
      let formData = new FormData(form);
  
      $.ajax({
        type: "POST",
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function(data)
        {
          try{
            data = JSON.parse(data);
            if (data.hasOwnProperty('error')){
                // TODO: afisezi eroare.
                console.log("eroare");
                return;
            }
  
            let cnp = data.student;
            let city = data.city;
            let emailStudent = data.emailStudent;
            let degree = data.degree;
            let hashValue = data.hashId;
  
            App.contracts.DiplomaStore.deployed().then(async function(instance) {
              console.log(instance.addDiploma);
              return instance.addDiploma(cnp, city, emailStudent, degree, hashValue, { from: App.accounts });
            }).then(function(result) {
              window.location.reload();
              alert("Diploma a fost introdusa cu succes");
            }).catch(function(err) {
              console.log(err);
              alert("Exista o eroare la introducerea diplomei - contract inteligent");
            });
          }
          catch(err){
            console.log("Error Json parse");
          }
        }
      });
      return false;
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
