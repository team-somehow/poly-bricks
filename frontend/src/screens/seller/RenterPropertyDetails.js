import React, { useState, useEffect } from "react";

import { Box, Typography, Paper } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import ListingSellerItem from "../../components/property/ListingSellerItem";
import { useAuth } from "@arcana/auth-react";
import ListingRenterItem from "../../components/property/ListingRenterItem";

function RenterPropertyDetails() {
    const [data, setData] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach(async (doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();
                // console.log(temp.ownerId,auth.currentUser.uid)

                if (
                    temp.ownerId === auth.user.publicKey &&
                    temp.type === "Rent"
                ) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            console.log(tData);
        };
        getProperties();
    }, [auth]);

    return (
        <Box m={5} width={"100%"}>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: "280px",
                    zIndex: -2,
                    background: 'url("/assets/bg5.jpg")',
                    filter: "brightness(50%)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    filter: "brightness(40%)",
                    backgroundAttachment: "fixed",
                    width: "calc(100% - 280px)",
                    minHeight: "100vh",
                }}
            ></Box>
            <Box
                component={Paper}
                sx={{
                    width: "95%",
                    textAlign: "center",
                    borderRadius: "0.5vw",
                    paddingTop: "12px",
                    backgroundColor: "white",
                    // marginBottom: "4.5vh",
                    height: "9vh",
                }}
            >
                <Typography variant="h4">
                    My Property Listings For Rent
                </Typography>
            </Box>
            <Box
                width={"100%"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "30px",
                    // paddingX:"3%",
                    // marginLeft: "-30px",
                }}
            >
                {data.map((item) => (
                    <ListingRenterItem key={item.id} {...item} />
                ))}
            </Box>
        </Box>
    );
}

export default RenterPropertyDetails;
