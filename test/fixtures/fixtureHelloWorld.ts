import { Signer } from "ethers";
import { ethers } from "hardhat";
import { HellowWorld } from "./../../typechain-types";

/**
 * @description Sets a initial state desired to every test
 */
export async function deployHelloWorldFixture(): Promise<IHellowWorldFixture> {
  // Contracts are deployed using the first signer/account by default
  const [
    owner,
    manager,
    teamMemberA,
    teamMemberB,
    accountA,
    accountB,
    accountC,
    accountD,
    accountE,
  ] = await ethers.getSigners();

  const HelloWorldFactory = await ethers.getContractFactory("HellowWorld");
  const contract = await HelloWorldFactory.deploy("Hello, world!");

  return {
    contract,
    owner,
    manager,
    teamMemberA,
    teamMemberB,
    accountA,
    accountB,
    accountC,
    accountD,
    accountE,
  };
}

export type IHellowWorldFixture = {
  contract: HellowWorld;
  owner: Signer;
  manager: Signer;
  teamMemberA: Signer;
  teamMemberB: Signer;
  accountA: Signer;
  accountB: Signer;
  accountC: Signer;
  accountD: Signer;
  accountE: Signer;
};
