import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

describe("Greeter", function () {
  let accounts: Signer[] = [];

  before(async () => {
    accounts = await ethers.getSigners();
  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it(`Should not be possible send Ether to a contract without 'receive' nor 'fallback'`, async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    const receipt = await accounts[0].sendTransaction({
      to: greeter.address,
      value: 100,
    });
  });
});
