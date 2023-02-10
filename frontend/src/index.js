import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";

const appID = "15228f3413342e43873a94d2ce54df3bb36b39f2";
const provider = new AuthProvider(appID,{
	alwaysVisible:false
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
		<ProvideAuth provider={provider} >
			<App />
		</ProvideAuth>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
	