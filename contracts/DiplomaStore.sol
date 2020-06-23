pragma solidity >=0.5.12 <0.7.0;

contract DiplomaStore {

    struct Diploma {
        string cnp; //cnp-ul studentului
        string city; //oras universitate
        string emailStudent; //email student
        string degree; //tipul de diploma
        string hashValue; //valoarea returnata de IPFS pe care o vom adauga pe Blockchain pe langa informatiile respective
    }
    mapping(address => Diploma[]) public university; //mapam diploma de universitate

    bool stopped = false;

    event LogDiplomaAdded(
        address indexed _university,
        string _cnp,
        string _city,
        string _emailStudent,
        string _degree,
        string _hashValue
    );

    //bool private stopped = false;
    event LogEmergencyStop(
        address indexed _university,
        bool _stop
    );

    //  modifier stopInEmergency {
    //     require(!stopped, "Adresa este gresita");
    //     _;
    // }
    //mapping(address => bool) public addressList;

    // function toString(address x) public returns (string memory) {
    //     bytes memory b = new bytes(20);
    //     for (uint i = 0; i < 20; i++)
    //         b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    //     return string(b);
    // }
    address owner = msg.sender;
    function addDiploma(string memory _cnp, string memory _city, string memory _emailStudent, string memory _degree, string memory _hashValue) public {
        //string memory senderAddress = toString(msg.sender);
        // string[7] memory addresses = ['0xFE7130987F97846fF0d4746d9a1A8155Db8F02d7',
        //                   '0xBD60268625Aa582b22bb21b3F3CDC165B6962De3',
        //                   '0xaEdbd61D177F170637475e7114C5A2F7C949D5bf',
        //                   '0xEfB5715Ad1D47F95FF0F4a43468Ad670Dba59bc8',
        //                   '0x571D5E7F972317Abfe7832c9B4571724077730F6',
        //                   '0x87d12f9070D28147caEe3FbD4C7307BCf471ECAF',
        //                   '0x9c03eb69F9c49E54dE74Fd02551bf4a5E5733F45'];
        //log0(bytes32(uint256(msg.sender)));
        //string memory addres = '0xFE7130987F97846fF0d4746d9a1A8155Db8F02d7';
        
        //require(((keccak256(abi.encodePacked(toString(owner))))==(keccak256(abi.encodePacked(addres)))), "Adresa este gresita");
        

        // for(uint i = 0; i < addresses.length; i++){
        //     if(keccak256(abi.encodePacked(addresses[i])) != keccak256(abi.encodePacked(toString(msg.sender)))){
        //         stopped = true;

        //     }
        // }

        require(owner == msg.sender, "Persoana nu poate executa contractul inteligent.");
        Diploma memory diploma = Diploma(_cnp, _city, _emailStudent, _degree, _hashValue);
        
        university[msg.sender].push(diploma);

        emit LogDiplomaAdded(msg.sender, _cnp, _city, _emailStudent, _degree, _hashValue);

    }

}