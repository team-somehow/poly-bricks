import { Typography } from "@mui/material";
import React from "react";
import CustomLottie from "./CustomLottie";

const TickMark = ({ text }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                margin: 5,
            }}
        >
            <div style={{ maxWidth: 35, marginRight: 5 }}>
                <CustomLottie path="animations/check1.json" />
            </div>
            <Typography className="mt-1" sx={{ fontSize: 18 }}>
                {text}
            </Typography>
        </div>
    );
};

export default TickMark;
