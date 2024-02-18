import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {BASE_URL} from "../constants";

export function FileAccess() {
    const navigate = useNavigate();
    const {state} = useLocation()
    const [email, setEmail] = useState("");
    const params = useParams()
    const [accesses, setAccesses] = useState(state.accesses);

    const [error, setError] = useState();

    async function deleteAccess(accessEmail) {
        const res = await fetch(`${BASE_URL}/files/${params.fileId}/accesses`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                email: accessEmail
            })
        })

        const data = await res.json()

        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }

        setAccesses(data)
    }

    async function addAccess(accessEmail) {
        const res = await fetch(`${BASE_URL}/files/${params.fileId}/accesses`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                email: accessEmail
            })
        })

        const data = await res.json()

        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }
        if (!res.ok) return setError(data.message?.email || data.message)

        setAccesses(data)

    }

    return <div>
        Доступы:
        <div>{accesses.map(access => <div>
            <p>{access.fullname} (<a href={`mailto:${access.email}`}>{access.email}</a>)</p>
            {access.type !== "author" && <button onClick={() => deleteAccess(access.email)}>Удалить доступ</button>}
        </div>)}
        </div>

        <input value={email} onInput={event => setEmail(event.currentTarget.value)}/>
        {error}
        <button onClick={() => addAccess(email)}>Открыть доступ</button>
    </div>
}