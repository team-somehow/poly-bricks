import { useNavigate } from "react-router-dom";
import { Auth } from "@arcana/auth-react";

const AuthContainer = (props) => {
    const navigate = useNavigate();

    return (
        <Auth
            externalWallet={true}
            theme="dark"
            onLogin={() => {
                navigate("/");
                localStorage.setItem("ye_dekh", "ho gaya");
            }}
        ></Auth>
    );
};

export default AuthContainer;
