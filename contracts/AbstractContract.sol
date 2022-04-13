//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

abstract contract AbstractContract {
    function virtualFunction() virtual public view returns(uint256);
    function virtualFunction2() virtual public view  returns(uint256);
    function virtualFunction3() virtual public pure  returns(uint256);
}
/**
 * Contracts must be marked as abstract when at least one of their functions is not 
 * implemented or when they do not provide arguments for all of their base contract 
 * constructors. Even if this is not the case, a contract may still be marked abstract, 
 * such as when you do not intend for the contract to be created directly. 
 */
contract NonAbstractContract is AbstractContract {
    function virtualFunction() public view override returns (uint256) {
        console.log("virtualFunction called");
        return 10;
    }

    // in order do be implemented to the child contracts, it has to mark as virtual again
    function virtualFunction2()
        public
        view
        virtual
        override
        returns (uint256)
    {}

    // virtualFunction3 can't be overrided by the GrandSon contract since it's not virtual
    function virtualFunction3()
        public
        pure
        override
        returns (uint256)
    {}
}

contract GrandSon is NonAbstractContract{
    function virtualFunction2()
        public
        view
        override
        returns (uint256)
    {
        console.log("grandson virtualFunction2");
        return 99;
    }
}