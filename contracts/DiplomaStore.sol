pragma solidity >=0.5.12 <0.7.0;

contract DiplomaStore {
    struct Diploma {
        uint cnp;
        string city;
        string emailStudent;
        string degree;
        string hashValue;
    }
    mapping(address => Diploma[]) public university; //mapam diploma de universitate
    
    event LogDiplomaAdded(
        address indexed _university,
        string _cnp,
        string _emailStudent,
        string _degree,
        string _hashValue
    );

    // string[10] addresses = ['0xFE7130987F97846fF0d4746d9a1A8155Db8F02d7',
    //                       '0xBD60268625Aa582b22bb21b3F3CDC165B6962De3',
    //                       '0xaEdbd61D177F170637475e7114C5A2F7C949D5bf',
    //                       '0xEfB5715Ad1D47F95FF0F4a43468Ad670Dba59bc8',
    //                       '0x571D5E7F972317Abfe7832c9B4571724077730F6',
    //                       '0x87d12f9070D28147caEe3FbD4C7307BCf471ECAF',
    //                       '0x9c03eb69F9c49E54dE74Fd02551bf4a5E5733F45'];

    function addDiploma(uint _cnp, 
                        string memory _city, 
                        string memory _emailStudent, 
                        string memory _degree, 
                        string memory _hashValue) 
    public{
        Diploma memory diploma = Diploma(_cnp, _city, _emailStudent, _degree, _hashValue);
        university[msg.sender].push(diploma);

        emit LogDiplomaAdded(
        msg.sender,
        _cnp, _city, _emailStudent, _degree, _hashValue);
    }

    function getDiploma(address _university, uint _index) public (
        uint _cnp,
        string memory _city,
        string memory _emailStudent,
        string memory _degree,
        string memory _hashValue
    ){
        Diploma storage diploma = university[_university][_index];
        return (
            diploma.hashValue,
            diploma.cnp,
            diploma.city,
            diploma.emailStudent,
            diploma.degree
        )
    }
}