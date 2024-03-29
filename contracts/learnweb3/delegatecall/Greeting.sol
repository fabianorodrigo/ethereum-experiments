//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Greeting {
    string public slotzeroVar = "hello";

    function greeting(address helper) public returns (string memory) {
        (bool success, bytes memory result) = helper.delegatecall(
            abi.encodeWithSignature("getGreeting()")
        );
        require(success, "The call to helper contract failed");
        return abi.decode(result, (string));
    }
}

contract Helper2 {
    function getGreeting() public view returns (string memory) {
        return "hello";
    }
}
