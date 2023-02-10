import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@arcana/auth-react";

const AuthChecker = ({ children }) => {
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoggedIn && !auth.loading) {
            // navigate("/login");
        }
    }, [auth, navigate]);

    return <>{children}</>;
};

export default AuthChecker;
