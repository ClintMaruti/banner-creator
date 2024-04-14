import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Canvas } from "./pages/canvas";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/canvas",
        element: <Canvas />,
    },
]);
