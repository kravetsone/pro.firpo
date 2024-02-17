import {useEffect, useState} from "react";
import {BASE_URL} from "../constants";
import {useNavigate} from "react-router-dom";

const accessType = {
    author: "Автор",
    "co-author": "Со-автор"
}

export function Files() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    async function fetchFiles() {
        const res = await fetch(BASE_URL + "/files/disk", {
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
            <p>Доступы:</p>
            <div>
                {file.accesses.map(access => <div>
                    <p>{access.fullname}</p>
                    <a href={`mailto:${access.email}`}>${access.email}</a>
                    <p>{accessType[access.type]}</p>
                </div>)}
            </div>
            <button>Удалить</button>
            <button>Редактировать</button>
            <button>Изменить права</button>
        </div>)}
    </div>
}