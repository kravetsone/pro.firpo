import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SignIn} from "./pages/SignIn";
import {SignUp} from "./pages/SignUp";
import {Files} from "./pages/Files";

const router = createBrowserRouter([
	{
		path: "/",
		element: <SignUp/>
	},
	{
		path: "/sign-in",
		element: <SignIn/>
	},
	{path: "/files",
	element: <Files/>}
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>,
);
