// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {OnlyCrypto} from "../src/OnlyCrypto.sol";

contract OnlyCryptoScript is Script {
    function setUp() public {}

    function run() public {
        uint deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        new OnlyCrypto();
    }
}
