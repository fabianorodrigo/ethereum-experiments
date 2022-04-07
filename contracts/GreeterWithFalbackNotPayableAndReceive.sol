//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GreeterWithFalbackNotPayableAndReceive {
    string private greeting;

    event Fallback(uint256 value, bytes data);
    event Receive(uint256 value, bytes data);

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
     * @notice Fallback must be external and payable and return nothing
     */
    fallback() external {
        console.log("fallback called");
        emit Fallback({value: 0, data: msg.data});
    }

    /**
     * @notice Receive must be external and payable. It's forbidden to use msg.data inside it
     * because it is only called when the data is empty. If try, you receive this message:
     * "msg.data" cannot be used inside of "receive" function.solidity(7139)
     */
    receive() external payable{
        console.log("receive called");
        bytes memory empty;
        emit Receive({value: msg.value, data: empty});
    }
}
