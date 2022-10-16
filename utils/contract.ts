import { ethers } from "hardhat";
import { appConfig } from "./config";
import { logger, LogLevel } from "./logger";
import { getAccount } from "./signers";

export async function getContractFactory(contractName: string, _signer?: any) {
  const signer = typeof _signer !== "undefined" ? _signer : await getAccount();
  logger(LogLevel.TRACE, `Using contract: ${contractName}`);
  const myContractFactory = await ethers.getContractFactory(contractName);
  return myContractFactory.connect(signer);
}

export const getContract = async (
  contractName: string,
  contractAddress: string,
  _signer?: any
) => {
  const signer = typeof _signer !== "undefined" ? _signer : await getAccount();
  logger(LogLevel.TRACE, `Using contract address: ${contractAddress}`);
  const myContract = await getContractFactory(contractName, signer);
  return myContract.attach(contractAddress);
};

export function contructorArgs(construtor: Record<string, any>): any[] {
  const args = [];
  for (const arg in construtor) {
    // eslint-disable-next-line no-prototype-builtins
    if (construtor.hasOwnProperty(arg)) {
      args.push(construtor[arg]);
    }
  }
  return args;
}

export const getDeployedContract = async (
  networkName: string,
  contractName: string,
  _signer?: any
) => {
  if (!appConfig.contract[contractName]) {
    throw new Error(
      `There is no data about '${contractName}' in file config.yml`
    );
  }

  if (!appConfig.contract[contractName][0].networks[networkName]) {
    throw new Error(
      `There is no ${contractName}'s ${networkName} address in file config.yml`
    );
  }
  const contractAddress =
    appConfig.contract[contractName][0].networks[networkName];

  const signer = typeof _signer !== "undefined" ? _signer : await getAccount();
  logger(LogLevel.INFO, `Using contract address: ${contractAddress}`);
  const myContract = await getContractFactory(contractName, signer);
  return myContract.attach(contractAddress);
};
