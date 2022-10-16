//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./HelloWorld.sol";

contract ExternalCallsWithoutGasStipends {
    function testGasStipends() public {
        HellowWorld calledContrat = new HellowWorld("gas stipends");
        calledContrat.setHello{gas: 30000}("gas stipends 2");
    }
}
