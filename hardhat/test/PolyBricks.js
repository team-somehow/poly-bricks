const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PolyBricks", function () {
    let polyBricks;
    let owner;
    let buyer1;
    let buyer2;
    let seller;
    let tokenId;
    let ipfsTitleDeedURI;
    let propertyPrice;
    let propertyId;

    before(async function () {
        // use ethers to get our contract
        const PolyBricks = await ethers.getContractFactory("PolyBricks");
        // and deploy it
        polyBricks = await PolyBricks.deploy();
        await polyBricks.deployed();

        // get addresses of users
        const [_owner, _buyer1, _buyer2, _seller] = await ethers.getSigners();
        owner = _owner;
        buyer1 = _buyer1;
        buyer2 = _buyer2;
        seller = _seller;

        ipfsTitleDeedURI = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
        propertyId = "1234";
        propertyPrice = 10;
        downPayment = 1;
    });

    it("Admin mints NFT for the seller's approved property", async function () {
        // balanceOf is built in to ERC 721
        let balance = await polyBricks.balanceOf(seller.address);
        // since recipient has not purchased any NFT so
        expect(balance).to.equal(0);

        const transaction = await polyBricks.mintNFT(
            seller.address,
            ipfsTitleDeedURI,
            propertyId
        );
        const newlyMintedToken = (await transaction.wait()).events[0].args
            .tokenId;

        tokenId = newlyMintedToken;

        // recheck the balance
        balance = await polyBricks.balanceOf(seller.address);
        // since recipient has purchased an NFT now so
        expect(balance).to.equal(1);

        // check that that particular NFT is minted
        expect(await polyBricks.isContentOwned(ipfsTitleDeedURI)).to.equal(
            true
        );
    });

    it("Seller creates listing for their approved property", async function () {
        await polyBricks
            .connect(seller)
            .createPropertyListing(tokenId, propertyPrice, downPayment);
    });

    it("Buyer1 makes down payment to the smart contract", async () => {
        await polyBricks
            .connect(buyer1)
            .makeDownPayment(tokenId, buyer1.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
    });

    it("Buyer2 makes down payment to the smart contract", async () => {
        await polyBricks
            .connect(buyer2)
            .makeDownPayment(tokenId, buyer2.address, {
                value: ethers.utils.parseEther(downPayment.toString()),
            });
    });

    it("Buyer2 accepted by seller, Buyer1's down payment refunded, escrow process begins", async () => {
        await polyBricks
            .connect(seller)
            .NFTOwnerStartEscrow(tokenId, buyer2.address);
    });

    it("Buyer1 completes payment, NFT transferred from smart contract to buyer, escrow process completed", async () => {
        await polyBricks.connect(buyer1).completePaymentAndEsrow(tokenId, {
            value: ethers.utils.parseEther(propertyPrice.toString()),
        });
    });

    it("lists property for rent", async () => {
        await polyBricks
            .connect(buyer1)
            .listPropertyForRent(
                tokenId,
                ethers.utils.parseEther("10"),
                ethers.utils.parseEther("5")
            );
    });

    it("allows buyer to deposit amount", async () => {
        await polyBricks.connect(buyer2).buyerPayRentAndDeposit(tokenId, {
            value: ethers.utils.parseEther("15"),
        });
    });

    it("allows user to pay rent", async () => {
        await polyBricks.connect(buyer2).payRent(tokenId, {
            value: ethers.utils.parseEther("5"),
        });
    });
});
