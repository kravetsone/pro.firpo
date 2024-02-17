import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../constants";

export function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    async function register() {
        const res = await fetch(BASE_URL + "/authorization", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        });

        const data = await res.json();

        if (res.status === 401) return setErrors({
            auth: data.message
        });

        if (!res.ok) return setErrors(data.message);

        localStorage.setItem("token", data.token)
        navigate("/files")
    }

    return <div>
        <input value={email} onInput={event => setEmail(event.currentTarget.value)}/>
        {"email" in errors && errors.email.join(", ")}
        <input value={password} onInput={event => setPassword(event.currentTarget.value)}/>
        {"password" in errors && errors.password.join(", ")}

        {"auth" in errors && errors.auth}
        <input type="submit" onClick={register}/>
    </div>
}