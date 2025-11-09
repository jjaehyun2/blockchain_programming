import hre from "hardhat";
import {expect} from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DECIMALS, MINTING_AMOUNT } from "./constant";

describe("My Token", () => {
    let myTokenC: MyToken;
    let signers: HardhatEthersSigner[];
    beforeEach("Should deploy", async () => {
        myTokenC = await hre.ethers.deployContract("MyToken", ["My Token", "MTK", DECIMALS, MINTING_AMOUNT]);
        signers = await hre.ethers.getSigners();
    });
    describe("Basic state value check", () => {
        it("should return", async () => {
            expect(await myTokenC.name()).to.equal("My Token");
        });
        it("should return", async () => {
            expect(await myTokenC.symbol()).to.equal("MTK");
        });
        it("should return", async () => {
            expect(await myTokenC.decimals()).to.equal(DECIMALS);
        });
        it("should return 100 totalSupply", async () => {
            expect(await myTokenC.totalSupply()).to.equal(MINTING_AMOUNT * 10n **DECIMALS);
        });
    })
    
    describe("Mint", () => {
        it("should return 1MTK balance for signer 0", async () => {
            const signer0 = signers[0];
            expect(await myTokenC.balanceOf(signer0.address)).to.equal(MINTING_AMOUNT * 10n**DECIMALS);
        });
        
        //TDD : Test Driven Development
        it("should return or revert when minting infinitly", async () => {
            const mintingAgainAmount = hre.ethers.parseUnits("10000", DECIMALS);
            const hacker = signers[2];
            await expect(myTokenC.connect(hacker).mint(mintingAgainAmount, hacker.address)).to.be.revertedWith("You are not authorized to manage this contract");
        });
    });
    //1MTK = 10^18

    describe("Transfer", () => {
        it("should have 0.5MTK", async () => {
            const signer0 = signers[0];
            const signer1 = signers[1];
            await expect(myTokenC.transfer(hre.ethers.parseUnits("0.5", DECIMALS), signer1.address))
                    .to.emit(myTokenC, "Transfer").withArgs(signer0.address, signer1.address, hre.ethers.parseUnits("0.5", DECIMALS));
            expect(await myTokenC.balanceOf(signer1.address)).to.equal(hre.ethers.parseUnits("0.5", DECIMALS));


        });
        it("should be reverted with insufficient balance error", async () => {
            const signer1 = signers[1];
            await expect(myTokenC.transfer(hre.ethers.parseUnits((MINTING_AMOUNT + 1n).toString(), DECIMALS), signer1.address)).to.be.revertedWith("insufficient balance");
        });
    });

    describe("TransferFrom", () => {
        it("should emit Approval event", async () => {
            const signer1 = signers[1];
            await expect(myTokenC.approve(signer1.address, hre.ethers.parseUnits("10", DECIMALS)))
                .to.emit(myTokenC, "Approval")
                .withArgs(signer1.address, hre.ethers.parseUnits("10", DECIMALS));
        });
        it("should be reverted with insufficient allowance error", async () => {
            const signer0 = signers[0];
            const signer1 = signers[1];
            await expect(myTokenC.connect(signer1).transferFrom(signer0.address, signer1.address, hre.ethers.parseUnits("1", DECIMALS)))
                .to.be.revertedWith("insufficient allowance");
        });
    });
    describe("Approve & TransferFrom homework", () => {
        it("should transfer 7.77MTK from signer0 to signer1", async () => {
            const signer0 = signers[0]; 
            const signer1 = signers[1]; 
            await expect(myTokenC.approve(signer1.address, hre.ethers.parseUnits("10", DECIMALS)))
                        .to.emit(myTokenC, "Approval")
                        .withArgs(signer1.address, hre.ethers.parseUnits("10", DECIMALS)); 
            await expect(myTokenC.connect(signer1).transferFrom(signer0.address, signer1.address, hre.ethers.parseUnits("7.77", DECIMALS)))
                .to.emit(myTokenC, "Transfer")
                .withArgs(signer0.address, signer1.address, hre.ethers.parseUnits("7.77", DECIMALS));
            expect(await myTokenC.balanceOf(signer1.address)).to.equal(hre.ethers.parseUnits("7.77", DECIMALS));
            expect(await myTokenC.balanceOf(signer0.address)).to.equal(hre.ethers.parseUnits("92.23", DECIMALS));
        });
    });
});
