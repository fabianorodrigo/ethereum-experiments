import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";

describe("Randomness Attack", function () {
  it("Should be able to guess the exact number", async function () {
    // deploy the Game contract
    const Game = await ethers.getContractFactory("Game");
    const _game = await Game.deploy({ value: utils.parseEther("0.1") });
    await _game.deployed();

    // Deploy attack contract
    const Attack = await ethers.getContractFactory("RandomnessAttack");
    const _attack = await Attack.deploy(_game.address);

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

    // Deploy attack contract
    const Attack = await ethers.getContractFactory("RandomnessAttack");
    const _attack = await Attack.deploy(_game.address);

    // TODO: entender por que mesmo passando 21.064 ainda falha: https://ethereum.stackexchange.com/questions/133728/msg-sender-callvalue-0-1-ether-gas-1-why-it-doesnt-fail-shouldnt
    // Valida a mensagem de erro retornada pela Hardhat Network: https://github.com/NomicFoundation/hardhat/blob/main/packages/hardhat-core/src/internal/hardhat-network/provider/node.ts
    await expect(_attack.attack({ gasLimit: 21064 })).to.be.rejectedWith(
      "Transaction ran out of gas"
    );
  });

  it("Should revert when transaction sent with less than 21064", async function () {
    // deploy the Game contract
    const Game = await ethers.getContractFactory("Game");
    const _game = await Game.deploy({ value: utils.parseEther("0.1") });
    await _game.deployed();

    // Deploy attack contract
    const Attack = await ethers.getContractFactory("RandomnessAttack");
    const _attack = await Attack.deploy(_game.address);

    // Valida a mensagem de erro retornada pela Hardhat Network: https://github.com/NomicFoundation/hardhat/blob/main/packages/hardhat-core/src/internal/hardhat-network/provider/node.ts
    await expect(_attack.attack({ gasLimit: 1 })).to.be.rejectedWith(
      "Transaction requires at least 21064 gas but got 1"
    );
  });
});
