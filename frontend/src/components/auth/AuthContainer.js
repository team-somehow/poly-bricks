import { useNavigate } from "react-router-dom";
import { Auth } from "@arcana/auth-react";

const AuthContainer = (props) => {
    const navigate = useNavigate();

    return (
        <Auth
            externalWallet={true}
            theme="dark"
            onLogin={() => navigate("/")}
        ></Auth>
    );
};

export default AuthContainer;
