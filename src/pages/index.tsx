import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Game } from "./Game";
import { Test } from "./Test";

export const router = createBrowserRouter([
{
    path: "/",
    Component: Game
},
{
    path: "/game/:code?",
    Component: Game
},
{
    path: "/test",
    Component: Test
},
]);

export const Pages = () => <RouterProvider router={router} />;

