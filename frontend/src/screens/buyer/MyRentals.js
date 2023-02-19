import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ListingMyRental from "../../components/property/ListingMyRental";
import { db } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchInput from "../../components/property/SearchInput";
import { useAuth } from "@arcana/auth-react";

const MyRentals = () => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        // console.log(auth.user.publicKey);
        if (!auth.user) return;

        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                console.log(doc.data());
                if (doc.data().renterId === auth.user.publicKey) {
                    tData.push({ ...doc.data(), id: doc.id });
                } else {
                    for (let i = 0; i < doc.data().rentRequests.length; i++) {
                        let temp = doc.data().rentRequests[i];
                        if (
                            // temp.approved === true &&
                            temp.uid === auth.user.publicKey
                        ) {
                            tData.push({
                                ...doc.data(),
                                id: doc.id,
                                maiKhareedSakta:
                                    temp.approved === true ? true : false,
                            });
                        }
                    }
                }
            });

            setData(tData);
            setTempData(tData);
            console.log(tData);
        };
        getProperties();
    }, [auth]);
    const updateProperties = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery.trim().length == 0) setData(tempData);
        else
            setData(
                tempData.filter((element) => element.name.includes(searchQuery))
            );
    };
    return (
        <Box m={2} style={{ marginTop: "3%" }}>
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
                <Typography variant="h4">My Properties</Typography>
            </Box>
            <SearchInput updateProperties={updateProperties} />
            <Box
                width={"76vw"}
                sx={{
                    display: "grid",
                    marginTop: "30px",
                    gridColumn: "3",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    // marginLeft: "-25px",
                }}
            >
                {data.map((item) => (
                    <div key={item.id}>
                        <ListingMyRental {...item} key={item.id} />
                        {/* {JSON.stringify(item)} */}
                    </div>
                ))}
            </Box>
        </Box>
    );
};

export default MyRentals;
