//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITest {
    function test() external;
}

interface ITestTwo {
    function testTwo() external;
}

interface ITestChild is ITest, ITestTwo {
    function testThree() external;
}
