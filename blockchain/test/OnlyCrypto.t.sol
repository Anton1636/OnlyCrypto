// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {OnlyCrypto} from "../src/OnlyCrypto.sol";

contract BadCreator {}

contract OnlyCryptoTest is Test {
    OnlyCrypto public onlyCrypto;
    address payable creator = payable(address(1));
    address member = address(2);
    address notMember = address(3);
    uint fee = 0.0001 ether;

    function setUp() public {
        onlyCrypto = new OnlyCrypto();
        deal(member, 1 ether);
        vm.startPrank(member);
    }

    function test_Join_Successful() public {
        onlyCrypto.join{value: fee}(creator);
        bool isMember1 = onlyCrypto.members(creator, member);
        bool isMember2 = onlyCrypto.members(creator, notMember);

        assertEq(isMember1, true);
        assertEq(isMember2, false);
        assertEq(creator.balance, fee);
    }

    function test_Join_PaymentTooLow() public {
        vm.expectRevert(OnlyCrypto.PaymentTooLow.selector);
        onlyCrypto.join{value: fee - 1}(creator);
        bool isMember = onlyCrypto.members(creator, member);
        assertEq(isMember, false);
    }

    function test_Joint_AlreadyMember() public {
        onlyCrypto.join{value: fee}(creator);
        vm.expectRevert(
            abi.encodeWithSelector(OnlyCrypto.AlreadyMember.selector, creator)
        );
        onlyCrypto.join{value: fee}(creator);
    }

    function test_Join_PaymentRejected() public {
        BadCreator badCreator = new BadCreator();
        vm.expectRevert(OnlyCrypto.PaymentRejected.selector);
        onlyCrypto.join{value: fee}(payable(address(badCreator)));
    }
}
