import { task } from "hardhat/config";

task(
  "testFailRequire",
  "Calls the testFailRequire function from HelloWorld contract"
)
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    // Esses imports dinâmicos são necessários pois durante a inicialização do hardhat
    // não é permitido importar o módulo 'hardhat' nem nenhum módulo que o importe
    const { appConfig, getDeployedContract, LogLevel, logger } = await import(
      "../utils"
    );
    const { provider } = hre.ethers;

    const CONTRACT_NAME: string = Object.keys(appConfig.contract)[0];
    const contract = await getDeployedContract(hre.network.name, CONTRACT_NAME);
    const account = ethers.utils.getAddress(taskArgs.account);

    const balanceBefore = await provider.getBalance(account);
    try {
      await contract.testFailRequire();
    } catch (e) {
      logger(LogLevel.ERROR, `testFailRequire failed as expected`);
    }
    const balanceAfter = await provider.getBalance(account);

    console.log("BEFORE: ", ethers.utils.formatEther(balanceBefore), "ETH");
    console.log("AFTER: ", ethers.utils.formatEther(balanceAfter), "ETH");
    console.log(
      "DIFF: ",
      ethers.utils.formatEther(balanceBefore.sub(balanceAfter)),
      "ETH"
    );
  });
