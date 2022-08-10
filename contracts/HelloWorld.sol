//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HellowWorld {
    string private greeting;
    uint256 public immutable imutavel;

    constructor(string memory _greeting) {
        greeting = _greeting;
        imutavel = 10;
    }

    function hello() public view returns (string memory) {
        return greeting;
    }

    function setHello(string memory _greeting) public {
        greeting = _greeting;
    }
}
