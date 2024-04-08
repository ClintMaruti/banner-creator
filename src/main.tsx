import { Theme } from "@radix-ui/themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Theme accentColor="green" grayColor="sand" radius="large" scaling="95%">
            <App />
        </Theme>
    </React.StrictMode>
);
