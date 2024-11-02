// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Unauthorized();
error InsufficientBalance(uint256 price, uint256 amount);
error PriceNotMet(uint256 price, uint256 amount);
error MetMaximumSupply(uint8);
error Reverted();