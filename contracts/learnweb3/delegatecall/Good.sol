//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Good {
    address public helper;
    address public owner;
    uint256 public num;

    constructor(address _helper) {
        helper = _helper;
        owner = msg.sender;
    }

    function setNum(uint256 _num) external {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }
}
