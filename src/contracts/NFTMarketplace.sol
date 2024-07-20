// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable(msg.sender) {
    uint256 public tokenCounter;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => bool) public tokensForSale;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI) public returns(uint256){
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public{
        require(ownerOf(tokenId) == msg.sender, "You are not owner of this NFT.");
        require(price > 0, "Price must be greater than zero");
        tokenPrices[tokenId] = price;
        tokensForSale[tokenId] = true;
    }

    function buyNFT(uint256 tokenId) public payable{
        require(tokensForSale[tokenId], "This NFT is not for sale.");
        require(msg.value >= tokenPrices[tokenId], "Not enough ether to purchase this NFT");
        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);

        payable(seller).transfer(msg.value);

        tokensForSale[tokenId] = false;
    }
}