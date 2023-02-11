import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import routes from "./config/routes";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";
import { useAuth } from "@arcana/auth-react";

function App() {
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        if (auth.isLoggedIn) {
            console.info("User detected.");
        } else {
            console.info("No user detected");
        }
        setLoading(false);
    }, [auth]);

    if (loading)
        return (
            <Center>
                <CircularProgress />
            </Center>
        );

    return (
        <div>
           <RouterProvider router={routes}/>
        </div>
    );
}

export default App;
