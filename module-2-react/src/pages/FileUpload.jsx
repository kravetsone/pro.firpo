import {useEffect, useState} from "react";
import {BASE_URL} from "../constants";
import {useNavigate} from "react-router-dom";

export function FileUpload() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    async function upload(uploadFiles) {
        const formData = new FormData();

        for (const file of uploadFiles) {
            formData.append("files[]", file)
        }

        const res = await fetch(BASE_URL + "/files", {
            method: "POST",
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        const data = await res.json();
        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }

        setFiles([...files, ...data])
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate("/sign-in")
    }, []);

    return <div>
        <button onClick={() => navigate("/files")}>Назад</button>
        <div>{files.map(file =>
            <p>{file.name} ({file.success ? "Успешно загружен" : "Произошла ошибка"})</p>)}</div>
        <div onDrag={e => upload([...e.dataTransfer.files])}>
            <input type="file" multiple onInput={e => upload([...e.currentTarget.files])}/>
        </div>
    </div>
}