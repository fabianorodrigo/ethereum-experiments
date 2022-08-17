import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

describe("GreeterWithFallbackAndReceive", function () {
  let accounts: Signer[] = [];
  let addressAccountZero: string;

  before(async () => {
    accounts = await ethers.getSigners();
    addressAccountZero = await accounts[0].getAddress();
  });

  it(`Should be possible send Ether to a contract with 'receive'`, async () => {
    const Greeter = await ethers.getContractFactory(
      "GreeterWithFallbackAndReceive"
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

  it(`Should use fallback function if send Ether with data to a contract with 'receive' and 'fallback' functions `, async () => {
    const Greeter = await ethers.getContractFactory(
      "GreeterWithFallbackAndReceive"
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
      data: ethers.utils.formatBytes32String(`Here is my data, mister Receive`),
    });
    await receipt.wait();
    // console.log(receipt);
    expect(receipt).to.emit(Greeter, "Fallback");
    expect(receipt).not.to.emit(Greeter, "Receive");
    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance.add(VALUE)
    );
    //It has to be less than the initial balance because of gas consuption
    expect(await greeter.provider.getBalance(addressAccountZero)).to.be.below(
      accounts0Balance.sub(VALUE)
    );
  });

  it(`Should NOT be possible send Ether to a contract with 'receive' without 'fallback' and the transaction has DATA`, async () => {
    const Greeter = await ethers.getContractFactory("GreeterWithReceive");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    const VALUE = 1979;

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
    ).revertedWith(
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
