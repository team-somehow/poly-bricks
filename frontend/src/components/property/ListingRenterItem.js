import {
    Box,
    Button,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Contract, ethers, providers } from "ethers";
import React, { useState } from "react";
import { contractAddress } from "../../constants";
import PolyBricks from "../../artifacts/contracts/PolyBricks.sol/PolyBricks.json";
import CustomizedDialogs from "../admin/DialogBox";

import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { arcanaProvider } from "../../index";

const ListingRenterItem = (props) => {
    const provider = new providers.Web3Provider(arcanaProvider.provider);
    // get the end user
    const signer = provider.getSigner();
    // get the smart contract
    const contract = new Contract(contractAddress, PolyBricks.abi, signer);
    const [stepCount, setStepCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState(null);

    const [stepCount1, setStepCount1] = useState(0);
    const [open1, setOpen1] = useState(false);
    const [err1, setErr1] = useState(null);

    const {
        name,
        type,
        images,
        rentRequests,
        titleDeed,
        tokenID,
        id,
        authorizeToSell,
        authorize,
        alreadySold,
    } = props;

    const [token, setToken] = useState(0.001);
    const [price, setPrice] = useState(0.01);
    const [authorizeToSellState, setAuthorizeToSellState] =
        useState(authorizeToSell);

    const [showrentRequests, setShowrentRequests] = useState(true);

    const listPropertyForRent = async () => {
        setOpen(true);
        const monthly = ethers.utils.parseUnits(token.toString(), 18);
        const deposit = ethers.utils.parseUnits(price.toString(), 18);
        const tokenIdOfThisProperty = tokenID;
        await arcanaProvider.connect();

        console.log(monthly, deposit);

        setStepCount((prev) => prev + 1);
        const result = await contract.listPropertyForRent(
            tokenIdOfThisProperty,
            deposit,
            monthly
        );
        result.wait();

        console.log("result", result);
        const propertyRef = doc(db, "ListedProperties", id);

        await updateDoc(propertyRef, {
            authorizeToSell: true,
            downPaymentPrice: token,
            price: price,
            alreadySold: false,
            type: type,
        });
        setAuthorizeToSellState(true);
        setStepCount((prev) => prev + 1);
    };

    const listPropertyForSale = async () => {
        setOpen(true);

        // take these values
        const depositAmt = ethers.utils.parseUnits(token.toString(), 18);
        const sellingPrice = ethers.utils.parseUnits(price.toString(), 18);

        // get these values from firebase
        const tokenIdOfThisProperty = tokenID;
        await arcanaProvider.connect();
        if (arcanaProvider.provider.connected) {
            console.log(contract);
            setStepCount((prev) => prev + 1);

            // call the pay to mint method on the smart contract
            const result = await contract.createPropertyListing(
                tokenIdOfThisProperty,
                sellingPrice,
                depositAmt
            );

            result.wait();

            console.log("result", result);
            const propertyRef = doc(db, "ListedProperties", id);

            await updateDoc(propertyRef, {
                authorizeToSell: true,
                downPaymentPrice: token,
                price: price,
                alreadySold: false,
                type: type,
            });
            setAuthorizeToSellState(true);
            setStepCount((prev) => prev + 1);
        }
    };

    const rent = async (buyerAddress, buyerUid) => {
        // console.log(rentRequests)
        let tData = [];
        for (let i = 0; i < rentRequests.length; i++) {
            if (rentRequests[i].walletAddress === buyerAddress) {
                tData.push({
                    uid: buyerUid,
                    name: rentRequests[i].name,
                    walletAddress: buyerAddress,
                    approved: true,
                });
            } else {
                tData.push({
                    ...rentRequests[i],
                });
            }
        }
        console.log("tData", tData);
        await updateDoc(doc(db, "ListedProperties", id), {
            rentRequests: tData,

            // remove property from listing
            alreadySold: true,
        });
        setShowrentRequests(false);
    };

    return (
        <>
            <CustomizedDialogs
                stepCount={stepCount}
                open={open}
                setOpen={setOpen}
                error={err}
                steps={[
                    "Connecting to Smart Contract",
                    "Waiting for response",
                    "Success",
                ]}
            />

            <CustomizedDialogs
                stepCount={stepCount1}
                open={open1}
                setOpen={setOpen1}
                error={err1}
                steps={[
                    "Connecting to Smart contract",
                    "Initiating Escrow",
                    "Success",
                ]}
            />
            <Paper
                sx={{
                    padding: 1,
                    my: 3,
                    width: "100%",
                    height: "420px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": {
                        // transitionDelay: "2s",
                        // boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
                        boxShadow:
                            "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
                    },
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={() => {
                    // navigate(`/property/${id}`);
                }}
            >
                <Box
                    sx={{
                        width: "40%",
                        height: "100%",
                        transition: "all 0.3s ease",
                    }}
                >
                    <img
                        src={images}
                        width="100%"
                        height={"100%"}
                        style={{ borderRadius: "6px 6px 0 0" }}
                        alt={name}
                    />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"stretch"}
                    width="50%"
                    m={4}
                >
                    <Box
                        sx={{
                            display: "flex",
                            marginY: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h3">{name}</Typography>
                        <a href={titleDeed.fileAddress} target="_blank">
                            <Button variant="outlined">title deed</Button>
                        </a>
                    </Box>
                    {console.log(
                        "asdfsadfsfsad",
                        showrentRequests,
                        JSON.stringify(rentRequests),
                        alreadySold
                    )}
                    {showrentRequests === true &&
                        rentRequests &&
                        alreadySold === false && (
                            <Box
                                border={"1px solid grey"}
                                p={2}
                                overflow={"hidden scroll"}
                                display={
                                    rentRequests.length == 0 ? "none" : "block"
                                }
                            >
                                {rentRequests.map((item, i) => (
                                    <>
                                        <Box
                                            key={item.uid + i}
                                            display={"flex"}
                                            justifyContent="space-between"
                                            alignItems={"center"}
                                            p={2}
                                        >
                                            <Typography>{item.name}</Typography>
                                            <Button
                                                onClick={() => {
                                                    console.log(type);
                                                    if (type === "Rent") {
                                                        rent(
                                                            item.walletAddress,
                                                            item.uid
                                                        );
                                                    }
                                                }}
                                                variant="contained"
                                            >
                                                Rent
                                            </Button>
                                        </Box>
                                        {rentRequests.length - 1 == i ? (
                                            ""
                                        ) : (
                                            <Divider />
                                        )}
                                    </>
                                ))}
                            </Box>
                        )}
                    {authorize === true && authorizeToSellState === false && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                textAlign: "left",
                            }}
                        >
                            <TextField
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                label={`${
                                    type !== "Sell" ? "Monthly Rent" : "Token"
                                }`}
                                sx={{
                                    marginBottom: "14px",
                                }}
                            >
                                {" "}
                            </TextField>
                            <TextField
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                label={`${
                                    type !== "Sell"
                                        ? "Deposit"
                                        : "Selling Price"
                                }`}
                                sx={{
                                    marginBottom: "20px",
                                }}
                            >
                                {" "}
                            </TextField>
                        </Box>
                    )}
                    {authorize === true && authorizeToSellState === false && (
                        <Box>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={
                                    type === "Sell"
                                        ? listPropertyForSale
                                        : listPropertyForRent
                                }
                            >
                                List Property
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </>
    );
};

export default ListingRenterItem;
