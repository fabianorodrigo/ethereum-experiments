import { network, run } from "hardhat";

import { appConfig, contructorArgs } from "../utils/";

async function main() {
  // Get Factory from config
  const contractName: string = Object.keys(appConfig.contract)[0];
  if (!appConfig.contract[contractName]) {
    appConfig.contract[contractName] = [];
  }

  // Somente se o contrato foi publicado na rede realizará a verificação
  if (
    appConfig.contract[contractName][0].networks[network.name] &&
    network.name !== "hardhat" &&
    network.name !== "localhost"
  ) {
    const args = contructorArgs(appConfig.contract[contractName][0].args);

    const contractAddress =
      appConfig.contract[contractName][0].networks[network.name];

    // If not local deploy, verify
    if (network.name !== "hardhat" && network.name !== "localhost") {
      try {
        // Verify the contract after deploying
        await run("verify:verify", {
          address: contractAddress,
          constructorArguments: args,
        });
      } catch (e: unknown) {
        console.log(`Contract verification failed: ${(e as Error).message}`);
      }
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
