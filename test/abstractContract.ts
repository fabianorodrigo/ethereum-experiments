import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

describe("NonAbstractContract", function () {
  let accounts: Signer[] = [];

  before(async () => {
    accounts = await ethers.getSigners();
  });

  it("Should run the overrided function", async function () {
    const NonAbstractContract = await ethers.getContractFactory(
      "NonAbstractContract"
    );
    const contract = await NonAbstractContract.deploy();
    await contract.deployed();
    expect(await contract.virtualFunction()).to.equal(10);
  });

  it("Should run the virtual function without real implementantion", async function () {
    const NonAbstractContract = await ethers.getContractFactory(
      "NonAbstractContract"
    );
    const contract = await NonAbstractContract.deploy();
    await contract.deployed();
    await contract.virtualFunction2();
  });

  it("Should run GrandSon virtualFunction3 not overrided function", async function () {
    const GrandSon = await ethers.getContractFactory("GrandSon");
    const contract = await GrandSon.deploy();
    await contract.deployed();
    await contract.virtualFunction3();
  });

  it("Should run GrandSon virtualFunction2 overrided function", async function () {
    const GrandSon = await ethers.getContractFactory("GrandSon");
    const contract = await GrandSon.deploy();
    await contract.deployed();
    expect(await contract.virtualFunction2()).to.equal(99);
  });
});
