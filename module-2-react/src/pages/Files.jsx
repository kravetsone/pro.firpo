import {useEffect, useState} from "react";
import {BASE_URL} from "../constants";
import {useNavigate} from "react-router-dom";
import {authDownload} from "../utils";

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

    async function deleteFile(fileId) {
        const res = await fetch(`${BASE_URL}/files/${fileId}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (res.status === 401) {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }

        fetchFiles()
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate("/sign-in")

        fetchFiles()
    }, []);

    return <div>
        {files.map(file => <div>
            <h4>Название - {file.name}</h4>
            <p>Идентификатор - ${file.file_id}</p>
            <button onClick={() => authDownload(file.url, file.name)}>Скачать</button>
            <p>Доступы:</p>
            <div>
                {file.accesses.map(access => <div>
                    <p>{access.fullname}</p>
                    <a href={`mailto:${access.email}`}>${access.email}</a>
                    <p>{accessType[access.type]}</p>
                </div>)}
            </div>
            <button onClick={() => deleteFile(file.file_id)}>Удалить</button>
            <button onClick={() => navigate(`/files/edit/${file.file_id}`, {
                state: {
                    name: file.name
                }
            })}>Редактировать
            </button>
            <button>Изменить права</button>
        </div>)}
    </div>
}