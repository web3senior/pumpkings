// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

event Log(string func, uint256 gas);
event tokenURIUpdated(uint256 indexed, string);
event tokenMetadataUpdated(bytes32 indexed, bytes);
event feeUpdated(string, uint256);