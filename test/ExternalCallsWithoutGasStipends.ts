import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  deployExternalCallsWithoutGasStipendsFixture,
  IExternalCallsWithoutGasStipendsFixture,
} from "./fixtures/fixtureExternalCallsWithoutGasStipends";

describe.only("ExternalCallsWithoutGasStipends", function () {
  let fixture: IExternalCallsWithoutGasStipendsFixture;
  beforeEach(async function () {
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    fixture = await loadFixture(deployExternalCallsWithoutGasStipendsFixture);
  });

  it("Should call testGasStipends", async function () {
    await fixture.contract.connect(fixture.accountE).testGasStipends();
  });
});
