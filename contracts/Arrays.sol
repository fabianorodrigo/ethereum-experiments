//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Arrays {
    uint256[] public arrayStorage;

    function initStorage(uint256 length) public returns (uint256) {
        arrayStorage = new uint256[](length);
        //console.log("arrayStorage.length",arrayStorage.length);
        return arrayStorage.length;
    }

    function getArrayStorageLength() public view returns (uint256) {
        return arrayStorage.length;
    }

    function initMemoryLiteralOrConstant() public view returns (uint256) {
        uint256[10] memory arrayMemory;
        console.log("arrayMemory.length", arrayMemory.length);
        return arrayMemory.length;
    }

    function initMemoryDynamically(uint256 length)
        public
        view
        returns (uint256)
    {
        uint256[] memory arrayMemory = new uint256[](length);
        console.log("arrayMemory.length", arrayMemory.length);
        return arrayMemory.length;
    }

    function initUnsizedMemory() public view returns (uint256) {
        uint256[] memory arrayMemory;
        console.log("arrayMemory.length", arrayMemory.length);
        return arrayMemory.length;
    }
}
