import * as dotenv from "dotenv";

import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import colors from "colors";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import readlineSync from "readline-sync";

import "./tasks/testFailRequire";

dotenv.config();

if (!process.env.MNEMONIC) {
  process.env.MNEMONIC = readlineSync.question("Wallet seed phrase: ", {
    hideEchoBack: true, // The typed text on screen is hidden by `*` (default).
  });
} else {
  console.log(
    colors.yellow(
      `SECURITY ALERT: Remove the wallet seed phrase from '.env' file and/or Environment Variables`
    ).bold
  );
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_API_KEY_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    goerli: {
      url: process.env.GOERLI_ALCHEMY_API_KEY_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
