pragma solidity ^0.8.28;

contract MultiManagedAccess {
    uint constant MANAGER_NUMBERS =5;

    address public owner;
    address[MANAGER_NUMBERS] public managers;
    bool [MANAGER_NUMBERS] public confirmed;
    constructor(address _owner, address[5] memory _managers) {
        owner = _owner;
        for(uint i = 0; i<MANAGER_NUMBERS; i++){
            managers[i] = _managers[i];
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    function allConfirmed() internal view returns(bool) {
        for(uint i = 0; i<MANAGER_NUMBERS; i++){
            if(!confirmed[i]){
                return false;
            }
        }
        return true;    
    }

    function reset() internal {
        for(uint i = 0; i<MANAGER_NUMBERS; i++){
            confirmed[i] = false;
        }
    }


    modifier onlyAllcConfirmed() {
        require(allConfirmed(), "Not all confirmed yet");
        reset();
        _;
    }

    function confirm() external {
        bool found = false;
        for(uint i=0; i<MANAGER_NUMBERS; i++){
            if(managers[i] == msg.sender){
                found = true;
                confirmed[i] = true;
                break;
            }
        }
        require(found, "You are not a managers"); 
    }
}

