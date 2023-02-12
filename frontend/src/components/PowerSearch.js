import React, { useState } from "react";
import { Box, Button, InputBase, Paper, Typography } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
function PowerSearch({ onSearch, title }) {
    const [isRent, setIsRent] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    return (
        <Box
            sx={{
                width: "95%",
                boxShadow: "0 20px 50px rgb(0 22 84 / 15%)",
                background: "#fff",
                padding: "40px 40px 30px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                my: 4,
            }}
        >
            <Typography variant="h2">{title}</Typography>

            <Box
                sx={{
                    position: "relative",
                    my: 2,
                    height: "30px",
                    width: { xl: "150px", md: "135px" },
                    background: "#ecf4ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    lineHeight: "30px",
                    padding: "0 15px",
                    borderRadius: "30px",
                }}
            >
                <div onClick={() => setIsRent(true)} style={{ zIndex: 3 }}>
                    <Typography
                        sx={{
                            color: isRent ? "white" : "#817f96",
                            zIndex: 3,
                            cursor: "pointer",
                            transition: "all 0.1s",
                        }}
                        variant="p"
                    >
                        Rent
                    </Typography>
                </div>
                <div onClick={() => setIsRent(false)} style={{ zIndex: 3 }}>
                    <Typography
                        sx={{
                            margin: "10px",
                            zIndex: 3,
                            color: isRent ? "#817f96" : "white",
                            cursor: "pointer",
                            transition: "all 0.1s",
                        }}
                        variant="p"
                    >
                        Buy
                    </Typography>
                </div>
                <Box
                    sx={{
                        position: "absolute",
                        background: "#3151b7",
                        width: { xl: "100px", md: "80px" },
                        height: "40px",
                        borderRadius: "40px",
                        top: "-5px",
                        left: isRent ? "-10px" : "calc(100% - 80px)",
                    }}
                ></Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xl: "center", md: "start" },
                    justifyContent: "space-evenly",
                    flexDirection: { xl: "row", md: "column" },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        marginRight: { xl: 2, md: 0 },
                        width: { md: "100%" },
                    }}
                >
                    <InputBase
                        sx={{
                            boxShadow: "0 5px 24px rgb(31 37 59 / 15%)",
                            background: "white",
                            height: "60px",
                            padding: "0 60px 0 20px",
                            borderRadius: "10px",
                            border: "1px solid #e1e5f2",
                            fontSize: "18px",
                            lineHeight: "58px",
                        }}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search... "
                        fullWidth
                    />
                    <Button
                        type="button"
                        sx={{
                            p: "10px",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "30px",
                            height: "60px",
                        }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "10px",
                        boxShadow: "0 5px 24px rgb(31 37 59 / 15%)",
                        border: "1px solid #e1e5f2",
                        my: 2,
                        marginRight: 2,
                        width: { md: "100%" },
                    }}
                >
                    <Box sx={{ position: "relative", width: "50%" }}>
                        <InputBase
                            inputProps={{
                                type: "numeric",
                                pattern: "[0-9]",
                            }}
                            sx={{
                                background: "white",
                                height: "60px",
                                padding: "0 20px 0 60px",
                                fontSize: "18px",
                                lineHeight: "58px",
                                borderTopLeftRadius: "10px",
                                borderBottomLeftRadius: "10px",
                                borderRight: "1px solid black",
                            }}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            fullWidth
                        />
                        <Button
                            type="button"
                            sx={{
                                p: "10px",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "30px",
                                height: "60px",
                            }}
                        >
                            <img src="/assets/matic.png" width="40px" />
                        </Button>
                    </Box>
                    <Box sx={{ position: "relative", width: "50%" }}>
                        <InputBase
                            inputProps={{
                                type: "numeric",
                                pattern: "[0-9]*",
                            }}
                            sx={{
                                background: "white",
                                height: "60px",
                                padding: "0 20px 0 60px",
                                fontSize: "18px",
                                lineHeight: "58px",
                                borderTopRightRadius: "10px",
                                borderBottomRightRadius: "10px",
                            }}
                            placeholder="Max"
                            onChange={(e) => setMaxPrice(e.target.value)}
                            fullWidth
                        />
                        <Button
                            type="button"
                            sx={{
                                p: "10px",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "30px",
                                height: "60px",
                            }}
                        >
                            <img src="/assets/matic.png" width="40px" />
                        </Button>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ width: { xl: "40%", md: "100%" } }}
                    onClick={() => onSearch(searchText, minPrice, maxPrice)}
                >
                    Search
                </Button>
            </Box>
        </Box>
    );
}

export default PowerSearch;
