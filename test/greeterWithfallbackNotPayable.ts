import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

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
      })
    ) // Valida a mensagem de erro retornada pela Hardhat Network: https://github.com/NomicFoundation/hardhat/blob/main/packages/hardhat-core/src/internal/hardhat-network/stack-traces/solidity-errors.ts
      .to.be.rejectedWith(
        `there's no receive function, fallback function is not payable and was called with value ${VALUE}`
      );

    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
    expect(await greeter.provider.getBalance(addressAccountZero)).to.be.equal(
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
    ) // Valida a mensagem de erro retornada pela Hardhat Network: https://github.com/NomicFoundation/hardhat/blob/main/packages/hardhat-core/src/internal/hardhat-network/stack-traces/solidity-errors.ts
      .to.be.rejectedWith(
        `fallback function is not payable and was called with value ${VALUE}`
      );

    expect(await greeter.provider.getBalance(greeter.address)).to.be.equal(
      greeterETherBalance
    );
    expect(await greeter.provider.getBalance(addressAccountZero)).to.be.equal(
      accounts0Balance
    );
  });
});
