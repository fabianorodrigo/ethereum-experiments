import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";

describe("Randomness Attack", function () {
  it("Should be able to guess the exact number", async function () {
    // deploy the Game contract
    const Game = await ethers.getContractFactory("Game");
    const _game = await Game.deploy({ value: utils.parseEther("0.1") });
    await _game.deployed();

    console.log("Game contract's address:", _game.address);

    // Deploy attack contract
    const Attack = await ethers.getContractFactory("RandomnessAttack");
    const _attack = await Attack.deploy(_game.address);

    console.log("Attack contract's address:", _attack.address);

    // Attack the Game Contract
    const tx = await _attack.attack();
    await tx.wait();

    const balanceGame = await _game.getBalance();
    // Balance should be zero
    expect(balanceGame).to.equal(ethers.constants.Zero);
  });

  it("Should revert with not enough gas is sent", async function () {
    // deploy the Game contract
    const Game = await ethers.getContractFactory("Game");
    const _game = await Game.deploy({ value: utils.parseEther("0.1") });
    await _game.deployed();

    console.log("Game contract's address:", _game.address);

    // Deploy attack contract
    const Attack = await ethers.getContractFactory("RandomnessAttack");
    const _attack = await Attack.deploy(_game.address);

    console.log("Attack contract's address:", _attack.address);

    // Attack the Game Contract

    //console.log(await _attack.attack({ gasLimit: 1 }));
    await expect(_attack.attack({ gasLimit: 21064 })).to.be.revertedWith(
      "TransactionExecutionError: Transaction ran out of gas"
    );
  });
});
