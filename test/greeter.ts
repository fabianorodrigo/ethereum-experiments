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

    const greeterETherBalance = await greeter.provider.getBalance(
      greeter.address
    );
    // revertedWith returns Chai.AsyncAssertion, so need to use of `await`
    await expect(
      accounts[0].sendTransaction({
        to: greeter.address,
        value: 100,
      })
    ).revertedWith(
      `function selector was not recognized and there's no fallback nor receive function`
    );
    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
  });
});
