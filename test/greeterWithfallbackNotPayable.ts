import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, waffle } from "hardhat";

describe("GreeterWithFallbackNotPayable", function () {
  let accounts: Signer[] = [];
  let addressAccountZero: string;

  before(async () => {
    accounts = await ethers.getSigners();
    addressAccountZero = await accounts[0].getAddress();
  });

  it(`Should NOT be possible send Ether to a contract without 'receive' and with NOT PAYABLE 'fallback' when transaction DOES NOT has data`, async () => {
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

  it(`Should NOT be possible send Ether to a contract without 'receive' and with NOT PAYABLE 'fallback' when transaction HAS data`, async () => {
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
        data: ethers.utils.formatBytes32String(
          `Here is my data, mister Receive`
        ),
      })
    ).revertedWith(
      `fallback function is not payable and was called with value ${VALUE}`
    );

    expect(await waffle.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
    expect(await waffle.provider.getBalance(addressAccountZero)).to.be.equal(
      accounts0Balance
    );
  });
});
