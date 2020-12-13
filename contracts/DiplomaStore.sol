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

    
    address owner = msg.sender;
    function addDiploma(string memory _cnp, string memory _city, string memory _emailStudent, string memory _degree, string memory _hashValue) public {
        
        require(owner == msg.sender, "Persoana nu poate executa contractul inteligent.");
        Diploma memory diploma = Diploma(_cnp, _city, _emailStudent, _degree, _hashValue);
        
        university[msg.sender].push(diploma);

        emit LogDiplomaAdded(msg.sender, _cnp, _city, _emailStudent, _degree, _hashValue);

    }

}