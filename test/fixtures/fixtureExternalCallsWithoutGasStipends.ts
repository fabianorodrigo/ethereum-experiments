import { Signer } from "ethers";
import { ethers } from "hardhat";

/**
 * @description Sets a initial state desired to every test
 */
export async function deployExternalCallsWithoutGasStipendsFixture(): Promise<IExternalCallsWithoutGasStipendsFixture> {
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

  const ExternalCallsWithoutGasStipendsFactory =
    await ethers.getContractFactory("ExternalCallsWithoutGasStipends");
  const contract = await ExternalCallsWithoutGasStipendsFactory.deploy();

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

export type IExternalCallsWithoutGasStipendsFixture = {
  contract: ExternalCallsWithoutGasStipends;
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
