// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

contract OnlyCrypto {
    uint public constant fee = 0.0001 ether;
    mapping(address => mapping(address => bool)) public members;

    error PaymentTooLow();
    error AlreadyMember(address creator);
    error PaymentRejected();

    function join(address payable creator) external payable {
        if (msg.value < fee) {
            revert PaymentTooLow();
        }
        if (members[creator][msg.sender] == true) {
            revert AlreadyMember(creator);
        }
        (bool sent, bytes memory _data) = creator.call{value: fee}("");
        if (!sent) {
            revert PaymentRejected();
        }
        members[creator][msg.sender] = true;
    }
}
