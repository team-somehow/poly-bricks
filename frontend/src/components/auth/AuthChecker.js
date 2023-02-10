import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { Auth, useAuth } from "@arcana/auth-react";

const AuthChecker = ({ children }) => {
    const navigate = useNavigate();

    const auth = useAuth();
    useEffect(() => {
        console.log(auth.user);
        if (!auth.isLoggedIn) {
            navigate("/login");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <>{children}</>;
};

export default AuthChecker;
