import { task } from "hardhat/config";

task(
  "testFailAssert",
  "Calls the testFailAssert function from HelloWorld contract"
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
    const account = hre.ethers.utils.getAddress(taskArgs.account);

    const balanceBefore = await provider.getBalance(account);
    try {
      await contract.testFailAssert();
    } catch (e) {
      logger(LogLevel.ERROR, `testFailAssert failed as expected`);
    }
    const balanceAfter = await provider.getBalance(account);

    console.log("BEFORE: ", hre.ethers.utils.formatEther(balanceBefore), "ETH");
    console.log("AFTER: ", hre.ethers.utils.formatEther(balanceAfter), "ETH");
    console.log(
      "DIFF: ",
      hre.ethers.utils.formatEther(balanceBefore.sub(balanceAfter)),
      "ETH"
    );
  });
