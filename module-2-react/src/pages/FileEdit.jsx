import {useEffect, useState} from "react";
import {BASE_URL} from "../constants";
import {useLocation, useNavigate, useParams} from "react-router-dom";

export function FileEdit() {
    const navigate = useNavigate();
    const params = useParams()
    const {state} = useLocation()
    const [name, setName] = useState(state.name);
    const [result, setResult] = useState();
    
    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate("/sign-in")
    }, []);

    async function renameFile(fileId) {
        const res = await fetch(`${BASE_URL}/files/${fileId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name
            })
        })

        const data = await res.json();

        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }
        if (!res.ok) return setResult(data.message.name)
        else setResult("Успешно загружено")
    }

    return <div>
        <button onClick={() => navigate("/files")}>Назад</button>
        <input value={name} onInput={e => setName(e.currentTarget.value)}/>
        {result}
        <button onClick={() => renameFile(params.fileId)}>Сохранить</button>
    </div>
}