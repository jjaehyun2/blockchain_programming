// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ManagedAccess.sol";

contract MyToken is ManagedAccess {
    event Transfer(address indexed from, address indexed to, uint256 value); //string을 hash로 만든게 topic값 //indexing topics에 넣어달라
    event Approval(address indexed spender, uint256 amount);

    string public name; //string 타입은 memory가 필요
    string public symbol; //eth
    uint8 public decimals; //uint8 --> 8 bit unsigned int ,...., uint256
    //public : 자동으로 getter 생성
    uint256 public totalSupply; //전체 몇개 발행
    mapping(address => uint256) public balanceOf;//누가 몇개//조회하는거는 동일한 값을 리턴해준다 tx를 만들 필요없음
    mapping(address => mapping(address => uint256)) public allowance; //approve, transferFrom

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _amount) ManagedAccess(msg.sender, msg.sender) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _mint(_amount * 10 ** uint256(decimals), msg.sender);    
    }



    function approve(address spender, uint256 amount) external {
        allowance[msg.sender][spender] = amount;
        emit Approval(spender, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external {
        address spender = msg.sender; //router contract
       
        require(allowance[from][spender] >= amount, "insufficient allowance");

        allowance[from][spender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        

        emit Transfer(from, to, amount);
    }


    function mint(uint256 amount, address to) external onlyManager {
        _mint(amount, to);
    }

    function setManager(address _manager) external onlyOwner {
        manager = _manager;
    }

    //화폐 발행시 mint
    //external 외부에서 호출 public 외부 내부 호출
    //internal 내부에서만 호출 _를 앞에 붙임
    function _mint(uint256 amount, address to) internal {
        totalSupply += amount;
        balanceOf[to] += amount;

        emit Transfer(address(0), to, amount); 
    }

    function transfer(uint256 amount, address to) external { //tx로 호출됨 -> tx생성
        require(balanceOf[msg.sender] >= amount, "insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }
}


/*
approve
 - allow sender address to send my token 
transferFrom 위임받은 사람이 내꺼에서 보냄
 - spender : owner -> target address   

token owner -> approve -> router contract(spender) -> transferFrom -> bank contract(target)
*/