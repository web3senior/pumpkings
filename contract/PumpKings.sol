// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import "./_pausable.sol";
import "./_event.sol";
import "./_error.sol";

/// @title PumpKings
/// @author Aratta Labs
/// @notice PumpKings contract version 1
/// @dev You can find deployed contract addresses in the README.md file
/// @custom:emoji 🎃
/// @custom:security-contact atenyun@gmail.com
contract PumpKings is LSP8IdentifiableDigitalAsset("PumpKings", "PMK", msg.sender, 2, 0), Pausable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    mapping(string => uint256) public fee;
    uint8 maxSupply = 58;

    constructor() {
        fee["mint_price"] = 2.4 ether;
        fee["update_price"] = 0 ether;
        _tokenIds.increment();
    }

    function getMetadata(bytes memory _rawMetadata) public pure returns (bytes memory) {
        bytes memory verfiableURI = bytes.concat(hex"00006f357c6a0020", keccak256(_rawMetadata), abi.encodePacked("data:application/json;base64,", Base64.encode(_rawMetadata)));
        return verfiableURI;
    }

    /// @notice New mint
    function mint(bytes memory _rawMetadata) public payable whenNotPaused returns (uint256) {
        if (msg.value < fee["mint_price"] && _msgSender() != owner()) revert PriceNotMet(fee["mint_price"], msg.value);
        if (_tokenIds.current() > maxSupply) revert MetMaximumSupply(maxSupply);

        // Mint NFT
        _tokenIds.increment();
        bytes32 _tokenId = bytes32(_tokenIds.current());
        _mint({to: _msgSender(), tokenId: _tokenId, force: true, data: ""});

        // Set metadata
        _setDataForTokenId(bytes32(_tokenIds.current()), 0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e, getMetadata(_rawMetadata));

        return _tokenIds.current();
    }

    /// @notice Update metadata
    function updateMetadata(bytes32 _tokenId, bytes memory _rawMetadata) public payable whenNotPaused returns (bytes32) {
        if (msg.value < fee["update_price"] && _msgSender() != owner()) revert PriceNotMet(fee["update_price"], msg.value);
        if (tokenOwnerOf(_tokenId) != _msgSender()) revert Unauthorized();

        // Set metadata
        _setDataForTokenId(_tokenId, 0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e,getMetadata(_rawMetadata));
        emit tokenMetadataUpdated(_tokenId, _rawMetadata);
        return _tokenId;
    }

    /// @notice Update fee
    function updateFee(string memory _name, uint256 _fee) public onlyOwner returns (bool) {
        fee[_name] = _fee;
        emit feeUpdated(_name, _fee);
        return true;
    }

    ///@notice Withdraw the balance from this contract and transfer it to the owner's address
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Failed");
    }

    ///@notice Transfer balance from this contract to input address
    function transferBalance(address payable _to, uint256 _amount) public onlyOwner {
        // Note that "to" is declared as payable
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed");
    }

    /// @notice Return the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Pause
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Unpause
    function unpause() public onlyOwner {
        _unpause();
    }
}
