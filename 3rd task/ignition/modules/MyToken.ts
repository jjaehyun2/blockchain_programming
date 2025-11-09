import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenDeploy", (m) => {
    const myToken = m.contract("MyToken", ["My Token", "MTK", 18]);

    return {myToken}; //감싸서
    
})