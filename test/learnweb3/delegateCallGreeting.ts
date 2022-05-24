import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, waffle } from "hardhat";

describe("Greeting DelegateCall", function () {
  it("Should return greeting", async function () {
    // Deploy the helper contract
    const helperContract = await ethers.getContractFactory("Helper2");
    const _helperContract = await helperContract.deploy();
    await _helperContract.deployed();
    console.log("Helper2 Contract's Address:", _helperContract.address);

    // Deploy the Greeting contract
    const greetingFactory = await ethers.getContractFactory("Greeting");
    const _greetingContract = await greetingFactory.deploy();
    await _greetingContract.deployed();
    console.log("Greeting Contract's Address:", _greetingContract.address);

    // Start the attack
    let tx = await _greetingContract.greeting(_helperContract.address);
    await tx.wait();
    console.log(tx);
    //expect(await _greetingContract.greeting()).to.equal("hello");
  });
});
