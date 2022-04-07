//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GreeterWithFallback {
    string private greeting;

    event Fallback(uint256 value, bytes data);

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    /**
     * @notice Fallback must be external and return nothing
     * It always receives data but to receive Ether it has
     * to be marked as payable
     */
    fallback() external payable {
        console.log("fallback called");
        emit Fallback({value: msg.value, data: msg.data});
    }
}
