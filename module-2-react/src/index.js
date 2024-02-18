import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SignIn} from "./pages/SignIn";
import {SignUp} from "./pages/SignUp";
import {Files} from "./pages/Files";
import {Shared} from "./pages/Shared";
import {FileUpload} from "./pages/FileUpload";
import {FileEdit} from "./pages/FileEdit";
import {FileAccess} from "./pages/FileAccess";

const router = createBrowserRouter([
    {
        path: "/",
        element: <SignUp/>
    },
    {
        path: "/sign-in",
        element: <SignIn/>
    },
    {
        path: "/files",
        element: <Files/>
    },
    {
        path: "/files/upload",
        element: <FileUpload/>
    },
    {
        path: "/files/edit/:fileId",
        element: <FileEdit/>
    },
    {
        path: "/files/accesses/:fileId",
        element: <FileAccess/>
    },
    {
        path: "/files/shared",
        element: <Shared/>
    }
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
