import { task } from "hardhat/config";

task(
  "testFailRevert",
  "Calls the testFailRevert function from HelloWorld contract"
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
    let tx;
    try {
      // Tivemos que setar o gasLimit para a transação ser efetivamente enviada para a rede da Goerli
      // Do contrário, a exceção ocorria antes mesmo de enviar, na biblioteca ethers.js:
      // cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ]
      tx = await contract.testFailRevert({ gasLimit: 50000 });
      await tx.wait();
    } catch (e: unknown) {
      logger(
        LogLevel.ERROR,
        `testFailRevert failed as expected: ${(e as Error).message}`
      );
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
