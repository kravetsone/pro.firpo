import {useEffect, useState} from "react";
import {BASE_URL} from "../constants";
import {useNavigate} from "react-router-dom";

export function Shared() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    async function fetchFiles() {
        const res = await fetch(BASE_URL + "/files/shared", {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();
        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }
        setFiles(data)
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate("/sign-in")

        fetchFiles()
    }, []);

    return <div>
        {files.map(file => <div>
            <h4>Название - {file.name}</h4>
            <p>Идентификатор - ${file.file_id}</p>
            <a href={file.url} download={true}>Скачать</a>
        </div>)}
    </div>
}