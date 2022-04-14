//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Arrays {

	uint[] public arrayStorage;

    function initStorage(uint length) public returns(uint) {
		arrayStorage = new uint[](length);
        console.log("arrayStorage.length",arrayStorage.length);
        return arrayStorage.length;
	}

    function getArrayStorageLength() public view returns(uint){
        return arrayStorage.length;
    }
	
	function initMemoryLiteralOrConstant() public view returns(uint) {
		uint[10] memory arrayMemory;
		console.log("arrayMemory.length",arrayMemory.length);
		return arrayMemory.length;
	}

	function initMemoryDynamically(uint length) public view returns(uint) {
		uint[] memory arrayMemory = new uint[](length);
		console.log("arrayMemory.length",arrayMemory.length);
		return arrayMemory.length;
	}

    function initUnsizedMemory() public view returns(uint){
		uint[] memory arrayMemory;
        console.log("arrayMemory.length",arrayMemory.length);
		return arrayMemory.length;
	}
}
