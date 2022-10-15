import { expect } from "chai";
import { ethers } from "hardhat";

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
    //console.log(tx);
    // Get the storage at storage slot 0 of _greetingContract's address
    const slot0Bytes = await ethers.provider.getStorageAt(
      _greetingContract.address,
      0
    );
    //TODO: entender porque o slot capturado pelo ethersjs já não vem com o tal do "null-termination" (posição 31 do array)
    console.log("slot0Bytes:", slot0Bytes, slot0Bytes.length);
    const slot0BytesArrayfied = ethers.utils.arrayify(slot0Bytes);
    console.log(
      "slot0BytesArrayfied:",
      slot0BytesArrayfied,
      slot0BytesArrayfied.length
    );
    const slot0BytesStr = ethers.utils.parseBytes32String(slot0Bytes);
    console.log("slot0BytesStr:", slot0BytesStr, slot0BytesStr.length);

    expect(slot0BytesStr).to.equal("hello");
  });
});
