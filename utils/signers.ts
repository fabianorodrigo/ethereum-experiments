import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";
import { appConfig } from "./config";
import { logger } from "./logger";

export async function getSigners() {
  logger(5, `Network Name: ${network.name}`);
  if (
    !appConfig.ledger.connect ||
    network.name === "hardhat" ||
    network.name === "localhost"
  ) {
    const hardhatSigners = await ethers.getSigners();
    logger(5, `Owner account: ${hardhatSigners[0].address}`);
    return hardhatSigners;
  }
  return [];
  //   const ledgerSigner = new LedgerSigner(
  //     ethers.provider,
  //     `m/44'/60'/${appConfig.ledger.path}'/0/0`
  //   );
  //   logger(5, `Ledger account: ${await ledgerSigner.getAddress()}`);
  //   return [ledgerSigner];
}

export const getOwner = async () => {
  const [owner] = await getSigners();
  return owner;
};

export const getAccount = async () => {
  return getOwner();
};

export async function filterSignerByAddress(
  signers: SignerWithAddress[],
  address: string
): Promise<SignerWithAddress | undefined> {
  for (const signer of signers) {
    const addr = (await signer.getAddress()).toLocaleLowerCase();
    if (addr == address.toLocaleLowerCase()) {
      return signer;
    }
  }
}
