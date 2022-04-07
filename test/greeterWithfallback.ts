import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, waffle } from "hardhat";

describe("GreeterWithFallback", function () {
  let accounts: Signer[] = [];
  let addressAccountZero: string;

  before(async () => {
    accounts = await ethers.getSigners();
    addressAccountZero = await accounts[0].getAddress();
  });

  it(`Should be possible send Ether to a contract without 'receive' but with 'fallback'`, async () => {
    const Greeter = await ethers.getContractFactory("GreeterWithFallback");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    const VALUE = 99;

    const greeterETherBalance = await waffle.provider.getBalance(
      greeter.address
    );
    const accounts0Balance = await waffle.provider.getBalance(
      addressAccountZero
    );
    // revertedWith returns Chai.AsyncAssertion, so need to use of `await`
    const receipt = await accounts[0].sendTransaction({
      to: greeter.address,
      value: VALUE,
    });
    await receipt.wait();
    // console.log(receipt);
    expect(receipt).to.emit(Greeter, "Fallback");
    expect(await waffle.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance.add(VALUE)
    );
    //It has to be less than the initial balance because of gas consuption
    expect(await waffle.provider.getBalance(addressAccountZero)).to.be.below(
      accounts0Balance.sub(VALUE)
    );
  });

  it(`Should NOT be possible send Ether to a contract without 'receive' and with NOT PAYABLE 'fallback'`, async () => {
    const Greeter = await ethers.getContractFactory(
      "GreeterWithFallbackNotPayable"
    );
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    const VALUE = 777;

    const greeterETherBalance = await waffle.provider.getBalance(
      greeter.address
    );
    const accounts0Balance = await waffle.provider.getBalance(
      addressAccountZero
    );
    // revertedWith returns Chai.AsyncAssertion, so need to use of `await`
    await expect(
      accounts[0].sendTransaction({
        to: greeter.address,
        value: VALUE,
      })
    ).revertedWith(
      `there's no receive function, fallback function is not payable and was called with value ${VALUE}`
    );

    expect(await waffle.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
    expect(await waffle.provider.getBalance(addressAccountZero)).to.be.equal(
      accounts0Balance
    );
  });
});
