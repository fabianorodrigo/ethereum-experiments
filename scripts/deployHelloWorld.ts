// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, network } from "hardhat";
import {
  appConfig,
  contructorArgs,
  getAccount,
  getContractFactory,
  logger,
  LogLevel,
  setConfig,
} from "../utils";

async function main() {
  logger(LogLevel.INFO, `Publishing Network: ${network.name}`);
  // Get Owner Account from config
  const account = await getAccount();
  logger(LogLevel.INFO, `Publisher account: ${await account.getAddress()}`);
  logger(
    LogLevel.INFO,
    `Publisher account balance: ${(await account.getBalance()).toString()}`
  );

  // Get Factory from config
  const contractName: string = Object.keys(appConfig.contract)[0];
  if (!appConfig.contract[contractName]) {
    appConfig.contract[contractName] = [];
  }

  if (!appConfig.contract[contractName][0]) {
    appConfig.contract[contractName][0] = { args: {}, networks: {} };
  }
  const contractFactory = await getContractFactory(contractName, account);

  logger(LogLevel.INFO, `Contract name: ${contractName}`);

  // Get Arguments from config
  if (!appConfig.contract[contractName][0].args) {
    appConfig.contract[contractName][0].args = {};
  }

  logger(
    LogLevel.INFO,
    `Constructor Arguments: ${JSON.stringify(
      appConfig.contract[contractName][0].args
    )}`
  );

  // se o contrato não foi publicado na rede ainda ou se trata de publicação local,
  // realiza o deploy
  if (
    !appConfig.contract[contractName][0].networks[network.name] ||
    network.name === "hardhat" ||
    network.name === "localhost"
  ) {
    const args = contructorArgs(appConfig.contract[contractName][0].args);
    const contract = await contractFactory.deploy(...args, {
      value: appConfig.contract[contractName][0].value,
      gasLimit: 10_000_000,
      gasPrice: ethers.utils.parseUnits("45", "gwei"),
    });
    await contract.deployed();
    console.log(
      `Contract ${contractName} deployed to address: ${contract.address}`
    );

    if (!appConfig.contract[contractName][0].networks) {
      appConfig.contract[contractName][0].networks = {};
    }

    appConfig.contract[contractName][0].networks[network.name] =
      contract.address;
    // Save arguments and contract address to config
    setConfig(appConfig);

    // If not local deploy, verify
    // if (network.name !== "hardhat" && network.name !== "localhost") {
    //   console.log("Waiting for contract verifying ...");
    //   // Wait for etherscan to notice that the contract has been deployed
    //   await sleep(60000);

    //   try {
    //     // Verify the contract after deploying
    //     await run("verify:verify", {
    //       address: contract.address,
    //       constructorArguments: args,
    //     });
    //   } catch (e: unknown) {
    //     console.log(`Contract verification failed: ${(e as Error).message}`);
    //   }
    // }
  } else {
    const contract = await contractFactory.attach(
      appConfig.contract[contractName][0].networks[network.name]
    );
    console.log(
      `Contract ${contractName} was already deployed as '${contractName}' to address: ${contract.address}`
    );
  }
  logger(LogLevel.TRACE, `Configuration of contract: ${contractName}`);
  logger(LogLevel.TRACE, appConfig.contract[contractName]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
