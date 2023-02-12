// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract PolyBricks is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public _tokenIdCounter;

    constructor() ERC721("PolyBricks", "PBRS") {}

    // to keep track of already minted URIs
    mapping(string => uint8) titleDeedURIs; // indicates if title deed exists
    mapping(string => string[]) titleDeedURIsToPropertyUIDs; // stores the property ids of those title deeds

    mapping(uint256 => uint256) public propertyPrice;
    mapping(uint256 => uint256) public downPayment;

    // to maintain downpayment
    mapping(uint256 => address[]) public tokenIdToBuyerAddress;
    mapping(address => uint256) public buyerAddressToDownPayment;
    mapping(address => address payable) public buyerAddressToBuyerPayableAddress;
    
    // to maintain seller address
    mapping(uint256 => address payable) public tokenIdToSellerPayableAddress;

    // rent 
    mapping(uint256 => uint256) public depositAmount;
    mapping(uint256 => uint256) public monthlyRentAmount;

    // renter address
    mapping(address => uint256) public renterAddressToMonthsPaid;


    function mintNFT(address recipient, string memory ipfsTitleDeedURI, string memory propertyId) public onlyOwner returns (uint256) {
        require(!isContentOwned(ipfsTitleDeedURI), "NFT already minted");

        // create new item ID, counter given by openzeppelin
        uint256 newItemId = getCurrentTokenIdCounter();

        // increment token by 1
        _tokenIdCounter.increment();

        // update mapping of existing URIs
        titleDeedURIs[ipfsTitleDeedURI] = 1;

        // store the property ID 
        titleDeedURIsToPropertyUIDs[ipfsTitleDeedURI] = [propertyId];

        // call built in mint method with recipient's wallet address
        _mint(recipient, newItemId);
        // set tokenURI on that ID
        _setTokenURI(newItemId, ipfsTitleDeedURI);

        _approve(msg.sender, newItemId);

        return newItemId;
    }

    // NFT owner can create listing
    function createPropertyListing(uint256 tokenId, uint256 _propertyPrice, uint256 _downPayment) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "only owner of NFT can create listing");
        propertyPrice[tokenId] = _propertyPrice ;
        downPayment[tokenId] = _downPayment;

        address addr = msg.sender;
        address payable wallet = payable(addr);

        tokenIdToSellerPayableAddress[tokenId] = wallet;
    }
    
    // buyer can make down payment
    function makeDownPayment(uint256 tokenId, address payable userPayableAddress) public payable {
        require( msg.value >= downPayment[tokenId], "please deposit correct amount");

        // buyerAddressToDownPayment[msg.sender] = msg.value;
        buyerAddressToBuyerPayableAddress[msg.sender] = userPayableAddress;

        // Retrieve the current array of buyers for the given token ID
        address[] storage currentBuyers = tokenIdToBuyerAddress[tokenId];
        // Append the new buyer to the array
        currentBuyers.push(userPayableAddress);
        
        // Update the mapping with the new array of buyers
        tokenIdToBuyerAddress[tokenId] = currentBuyers;
    }

    // helper
    function tranfer(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId);
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

     // start escrow
    function NFTOwnerStartEscrow(uint256 tokenId, address chosenBuyer) public payable {
        require(_isApprovedOrOwner(msg.sender, tokenId), "only owner of NFT can start escrow process");
       
        // Transfer NFT from seller to this contract
        tranfer(msg.sender, address(this), tokenId);

        // refund all down payments
        address[] memory buyerAddresses = tokenIdToBuyerAddress[tokenId];
        for (uint256 i = 0; i < buyerAddresses.length; i++) {
            if (buyerAddresses[i] != chosenBuyer) {
                address payable buyerPayableAddress = payable(buyerAddressToBuyerPayableAddress[address(buyerAddresses[i])]);
                uint256 transferAmt = downPayment[tokenId];
                buyerPayableAddress.transfer(transferAmt);
            }
        }

    }

    function completePaymentAndEsrow(uint256 tokenId) public payable {
        require( msg.value >= propertyPrice[tokenId] - downPayment[tokenId], "please pay correct amount");

        // transfer NFT to seller
        tranfer(address(this), msg.sender, tokenId);

        address payable sellerPayableAddress = tokenIdToSellerPayableAddress[tokenId];
        uint256 transferAmt = propertyPrice[tokenId];
        sellerPayableAddress.transfer(transferAmt);
    }

    // RENT 

    // record deposit and monthly rent given by seller
    function listPropertyForRent(uint256 tokenId, uint256 _depositAmount, uint256 _monthlyRentAmount) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "only owner of NFT can list property for rent");
        depositAmount[tokenId] = _depositAmount;
        monthlyRentAmount[tokenId] = _monthlyRentAmount;
    }

    // pay rent + deposit
    // buyerPayRentAndDeposit
    function buyerPayRentAndDeposit(uint256 tokenId) public payable {
        require( msg.value >= depositAmount[tokenId] + monthlyRentAmount[tokenId], "please deposit correct amount");
        renterAddressToMonthsPaid[msg.sender] += 1;
    }

    function payRent(uint256 tokenId) public payable {
        require( msg.value >= monthlyRentAmount[tokenId], "please pay correct amount");
        renterAddressToMonthsPaid[msg.sender] += 1;
        tokenIdToSellerPayableAddress[tokenId].transfer(msg.value);
    }

    // util override 
    function safeTransferFrom(address from, address to, uint256 tokenId) override(ERC721) public  {
        require(from != address(0), "From address is not valid");
        require(to != address(0), "To address is not valid");
        require(_isApprovedOrOwner(from, tokenId), "Transfer not permitted");
        _transfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // these are custom helper functions
    function isContentOwned(string memory uri) public view returns(bool) {
        // returns true if URI already exists in the mapping
        return titleDeedURIs[uri] == 1;
    }

    function getCurrentTokenIdCounter() public view returns (uint256) {
        uint256 prevItemId = _tokenIdCounter.current();
        return  prevItemId;
    }
}