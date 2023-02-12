import React from "react";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ListingItem from "../../components/property/ListingItem";
import { db, auth } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchInput from "../../components/property/SearchInput";
import { useAuth } from "@arcana/auth-react";
import PowerSearch from "../../components/PowerSearch";

const Properties = () => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();
                if (
                    temp.authorize !== false &&
                    temp.authorizeToSell !== false &&
                    temp.alreadySold !== true &&
                    temp.ownerId !== auth.user.publicKey
                ) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            setTempData(tData);
        };
        getProperties();
    }, [auth]);
    // const updateProperties = (e) => {
    //     const searchQuery = e.target.value;
    //     if (searchQuery.trim().length == 0) setData(tempData);
    //     else
    //         setData(
    //             tempData.filter((element) => element.name.includes(searchQuery))
    //         );
    // };
    const filterProperties = (searchText, minPrice, maxPrice) => {
        let filteredData = [];
        if (searchText.trim().length == 0 && maxPrice == 0 && minPrice == 0)
            return setData(tempData);
        if (searchText.trim().length != 0)
            filteredData = tempData.filter((element) =>
                element.name.toLowerCase().includes(searchText.toLowerCase())
            );
        if (minPrice)
            filteredData = filteredData.filter((e) => e.price > minPrice);
        if (maxPrice)
            filteredData = filteredData.filter((e) => e.price < maxPrice);
        setData(filteredData);
    };
    return (
        <Box m={2} style={{ marginTop: "3%" }}>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: "280px",
                    zIndex: -2,
                    background: 'url("/assets/hero-city.svg")',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    width: "calc(100% - 280px)",
                    minHeight: "100vh",
                }}
            ></Box>
            {/* <Box
                ccomponent={Paper}
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
                <Typography variant="h4">Availabe Properties</Typography>
            </Box> */}
            {/* <SearchInput updateProperties={updateProperties} /> */}
            <PowerSearch
                onSearch={filterProperties}
                title="Availabe Properties"
            />
            <Box
                width={"76vw"}
                sx={{
                    display: "grid",
                    marginTop: "30px",
                    gridColumn: "3",
                    // gridGap: "10px",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    // paddingX:"3%",
                }}
            >
                {data.map((item) => (
                    <ListingItem {...item} key={item.id} />
                ))}
            </Box>
        </Box>
    );
};

export default Properties;
