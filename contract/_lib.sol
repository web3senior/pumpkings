// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library RNG {
    function get(uint256 nonce, uint256 max) public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % max;
    }
}
