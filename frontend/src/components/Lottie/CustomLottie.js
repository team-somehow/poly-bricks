import lottie from "lottie-web";
import React, { useEffect, useRef } from "react";

const CustomLottie = ({ path }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (animationRef.current) {
            lottie.loadAnimation({
                container: animationRef.current,
                loop: false,
                autoplay: true,
                path: path,
            });
        }
    }, []);

    return <div ref={animationRef} />;
};

export default CustomLottie;
