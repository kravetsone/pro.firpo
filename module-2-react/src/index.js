import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SignIn} from "./pages/SignIn";
import {SingUp} from "./pages/SingUp";

const router = createBrowserRouter([
	{
		path: "/",
		element: <SingUp/>
	},
	{
		path: "/sign-in",
		element: <SignIn/>
	}
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>,
);
