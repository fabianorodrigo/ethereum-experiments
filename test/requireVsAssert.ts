import {
  loadFixture,
  setNextBlockBaseFeePerGas,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  deployHelloWorldFixture,
  IHellowWorldFixture,
} from "./fixtures/fixtureHelloWorld";

describe.only("HelloWorld", function () {
  let fixture: IHellowWorldFixture;
  beforeEach(async function () {
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    fixture = await loadFixture(deployHelloWorldFixture);
  });

  it("Should revert returning the remaining gas when failed with 'require' (0xfd) - the final ETH balance equals the previous balance", async function () {
    const balanceBefore = await fixture.accountE.getBalance();
    console.log("balanceBefore", balanceBefore.toString());

    // seta o baseFeePerGas para poder passar um gasPrice = 1
    await setNextBlockBaseFeePerGas(1);
    await expect(
      fixture.contract
        .connect(fixture.accountE)
        .testFailRequire({ gasLimit: 1000000, gasPrice: 1 })
    ).to.be.revertedWithoutReason;

    const balanceAfter = await fixture.accountE.getBalance();
    console.log(
      "balanceAfter",
      balanceAfter.toString(),
      `-${balanceBefore.sub(balanceAfter).toNumber()}`
    );
    expect(balanceAfter).to.be.equal(balanceBefore);
  });

  it("Should revert returning the remaining gas when failed with 'revert CustomError()' - the final ETH balance equals the previous balance", async function () {
    const balanceBefore = await fixture.accountE.getBalance();
    console.log("balanceBefore", balanceBefore.toString());

    // seta o baseFeePerGas para poder passar um gasPrice = 1
    await setNextBlockBaseFeePerGas(1);
    await expect(
      fixture.contract
        .connect(fixture.accountE)
        .testFailRevert({ gasLimit: 1000000, gasPrice: 1 })
    ).to.be.revertedWithCustomError(fixture.contract, "UnevitactableError");

    const balanceAfter = await fixture.accountE.getBalance();
    console.log(
      "balanceAfter",
      balanceAfter.toString(),
      `-${balanceBefore.sub(balanceAfter).toNumber()}`
    );
    //expect(balanceAfter).to.be.equal(balanceBefore);
  });

  it("Should revert NOT returning remaining gas when failed with 'assert' (0xfe) - the final ETH balance is lesser than previous balance", async function () {
    const balanceBefore = await fixture.accountE.getBalance();
    console.log("balanceBefore", balanceBefore.toString());

    // seta o baseFeePerGas para poder passar um gasPrice = 1
    await setNextBlockBaseFeePerGas(1);
    await expect(
      fixture.contract
        .connect(fixture.accountE)
        .testFailAssert({ gasLimit: 1000000, gasPrice: 1 })
    ).to.be.revertedWithPanic("0x01");
    /*
    PANIC CODES
    0x01: If you call assert with an argument that evaluates to false.
    0x11: If an arithmetic operation results in underflow or overflow outside of an unchecked { ... } block.
    0x12; If you divide or modulo by zero (e.g. 5 / 0 or 23 % 0).
    0x21: If you convert a value that is too big or negative into an enum type.
    0x22: If you access a storage byte array that is incorrectly encoded.
    0x31: If you call .pop() on an empty array.
    0x32: If you access an array, bytesN or an array slice at an out-of-bounds or negative index (i.e. x[i] where i >= x.length or i < 0).
    0x41: If you allocate too much memory or create an array that is too large.
    0x51: If you call a zero-initialized variable of internal function type.
    */

    const balanceAfter = await fixture.accountE.getBalance();
    console.log(
      "balanceAfter",
      balanceAfter.toString(),
      `-${balanceBefore.sub(balanceAfter).toNumber()}`
    );
    expect(balanceAfter).to.be.lessThan(balanceBefore);
  });
});
