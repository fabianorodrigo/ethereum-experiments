//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HellowWorld {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function hello() public view returns (string memory) {
        return greeting;
    }

    function setHello(string memory _greeting) public {
        greeting = _greeting;
    }
}
