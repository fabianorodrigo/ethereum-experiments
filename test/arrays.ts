import { expect } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Arrays", function () {
  let accounts: Signer[] = [];
  let Arrays: ContractFactory;
  let contract: Contract;

  before(async () => {
    accounts = await ethers.getSigners();
    Arrays = await ethers.getContractFactory("Arrays");
  });

  this.beforeEach(async () => {
    contract = await Arrays.deploy();
    await contract.deployed();
  });

  it("Should return arrayStorage.length dynamic initialized", async function () {
    const length = Math.floor(Math.random() * 100);
    // funções que NÃO são view/pure recebem um recibo ao invés do resultado direto
    const receipt = await contract.initStorage(length);
    await receipt.wait();
    expect(await contract.arrayStorage(length - 1)).to.be.equal(0);
    await expect(contract.arrayStorage(length)).to.reverted;
    expect(await contract.getArrayStorageLength()).to.be.equal(length);
  });

  it("Should arrayStorage.length unsized has zero length", async function () {
    expect(await contract.getArrayStorageLength()).to.be.equal(0);
  });

  it("Should return arrayMemory.length fixed initialized", async function () {
    // funções que são view/pure recebem o resultado direto da função
    expect(await contract.initMemoryLiteralOrConstant()).to.equal(10);
  });

  it("Should return arrayMemory.length dynamic initialized", async function () {
    const length = Math.floor(Math.random() * 100);
    // funções que são view/pure recebem o resultado direto da função
    expect(await contract.initMemoryDynamically(length)).to.equal(length);
  });

  it("Should arrayMemory.length unsized has zero length", async function () {
    // funções que são view/pure recebem o resultado direto da função
    expect(await contract.initUnsizedMemory()).to.equal(0);
  });
});
