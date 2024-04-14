import { Theme } from "@radix-ui/themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Theme accentColor="green" grayColor="sand" radius="large" scaling="95%">
            <RouterProvider router={router} />
        </Theme>
    </React.StrictMode>
);
