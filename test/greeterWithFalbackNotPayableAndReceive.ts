import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

describe("GreeterWithFalbackNotPayableAndReceive", function () {
  let accounts: Signer[] = [];
  let addressAccountZero: string;

  before(async () => {
    accounts = await ethers.getSigners();
    addressAccountZero = await accounts[0].getAddress();
  });

  it(`Should be possible send Ether to a contract with 'receive' and a not payable 'fallback'`, async () => {
    const Greeter = await ethers.getContractFactory(
      "GreeterWithFalbackNotPayableAndReceive"
    );
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    const VALUE = 167;

    const greeterETherBalance = await greeter.provider.getBalance(
      greeter.address
    );
    const accounts0Balance = await greeter.provider.getBalance(
      addressAccountZero
    );
    // revertedWith returns Chai.AsyncAssertion, so need to use of `await`
    const receipt = await accounts[0].sendTransaction({
      to: greeter.address,
      value: VALUE,
    });
    await receipt.wait();
    // console.log(receipt);
    expect(receipt).to.emit(Greeter, "Receive");
    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance.add(VALUE)
    );
    //It has to be less than the initial balance because of gas consuption
    expect(await greeter.provider.getBalance(addressAccountZero)).to.be.below(
      accounts0Balance.sub(VALUE)
    );
  });

  it(`Should NOT be possible send Ether to a contract with 'receive' and with a NOT PAYABLE 'fallback' if transaction has DATA`, async () => {
    const Greeter = await ethers.getContractFactory("GreeterWithReceive");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    const VALUE = 1919;

    const greeterETherBalance = await greeter.provider.getBalance(
      greeter.address
    );
    const accounts0Balance = await greeter.provider.getBalance(
      addressAccountZero
    );
    // revertedWith returns Chai.AsyncAssertion, so need to use of `await`
    await expect(
      accounts[0].sendTransaction({
        to: greeter.address,
        value: VALUE,
        data: ethers.utils.formatBytes32String(
          `Here is my data, mister Receive`
        ),
      })
    ).to.be.rejectedWith(
      `function selector was not recognized and there's no fallback function`
    );

    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
    expect(await greeter.provider.getBalance(addressAccountZero)).to.be.equal(
      accounts0Balance
    );
  });
});
