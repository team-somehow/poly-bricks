import { Box, Typography } from "@mui/material";
import React from "react";

function ProcessSection({ backgroundColor, imageUrl, heading, steps }) {
    return (
        <Box
            bgcolor={backgroundColor}
            display={"flex"}
            alignItems="center"
            height={"100vh"}
            position={"relative"}
        >
            <Box
                sx={{
                    width: "90%",
                    margin: "auto",
                    height: "80vh",
                    background: `url(${imageUrl}) no-repeat center bottom`,
                    backgroundSize: "contain",
                }}
            ></Box>
            <Box
                sx={{
                    position: "absolute",
                    top: "25%",
                    left: "6%",
                }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    color={"#348FF9"}
                    letterSpacing={"2px"}
                    my={8}
                    data-aos="zoom-in"
                    data-aos-duration={500}
                >
                    {heading}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {steps.map((element) => (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                py: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    background: "blue",
                                    p: 1,
                                    borderRadius: "50%",
                                }}
                            >
                                <img src={element.icon} width={30} />
                            </Box>
                            <Typography variant="h6" sx={{ px: 4 }}>
                                {element.title}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default ProcessSection;
