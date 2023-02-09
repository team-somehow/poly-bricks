import { AppMode, AuthProvider } from "@arcana/auth";
import { useState } from "react";

const appID = "15228f3413342e43873a94d2ce54df3bb36b39f2";

let auth;
function useArchanaAuth() {
	const [initialised, setInitialised] = useState(false);

	const initializeAuth = async () => {
		if (!auth) {
			auth = new AuthProvider(appID);
			await auth.init({ appMode: AppMode.NoUI });
			setInitialised(true);
		}
	};

	const login = async (socialType) => {
		if (initialised) {
			await auth.loginWithSocial(socialType);
		}
	};

	const isLoggedIn = async () => {
		if (initialised) {
			return await auth.isLoggedIn();
		}
	};

	const getAccounts = async () => {
		if (initialised)
			return await auth.provider.request({ method: "eth_accounts" });
	};

    const logout=async()=>{
        if(initialised)
        await auth.logout
    }


    return {
        initialised,
        login,
        initializeAuth,
        isLoggedIn,
        getAccounts,
        logout
    }
}



export default useArchanaAuth;
