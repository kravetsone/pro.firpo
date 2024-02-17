import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../constants";

export function SingUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState({});

    async function register() {
        const res = await fetch(BASE_URL + "/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })
        });

        const data = await res.json();

        if (!res.ok) return setErrors(data.message);

        localStorage.setItem("token", data.token)
        navigate("/sign-in")
    }

    return <div>
        <input value={email} onInput={event => setEmail(event.currentTarget.value)}/>
        {"email" in errors && errors.email.join(", ")}
        <input value={password} onInput={event => setPassword(event.currentTarget.value)}/>
        {"password" in errors && errors.password.join(", ")}
        <input value={firstName} onInput={event => setFirstName(event.currentTarget.value)}/>
        {"firstName" in errors && errors.firstName.join(", ")}
        <input value={lastName} onInput={event => setLastName(event.currentTarget.value)}/>
        {"lastName" in errors && errors.lastName.join(", ")}

        <input type="submit" onClick={register}/>
    </div>
}