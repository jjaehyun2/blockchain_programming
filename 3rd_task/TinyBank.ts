import hre from "hardhat";
import { except } from "chai"
import {DECIMALS , MINTING_AMOUNT} from "./constant";

describe("TinyBank", () => {
    let myTokenC;
    let tinyBankC;
    beforeEach(async () => {
        myTonkenc = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            DECIMALS,
            MINTING_AMOUNT,
        ]);
        tinyBankC = await hre.ethers.deployContract("TinyBank", [
            await myTonkenc.getAddress(),
        ]);
        
    });
    describe("Staking", async () => {
    it("should return staked amount", async () => {
        const signer0 = signers[0];
        const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
        await myToken.approve(tinyBankC.getAddress(), stakingAmount);
        await tinyBankC.stake(stakingAmount);
        expect(await tinyBankC.staked(signer0.address)).equal(stakingAmount);
        expect(await tinyBankC.totalStaked()).equal(stakingAmount);
        expect(await myToken.balanceOf(tinyBankC)).equal(
            await tinyBankC.totalStaked()
        );
        });
    });
});