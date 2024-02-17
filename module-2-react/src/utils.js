export async function authDownload(url, name) {
    const res = await fetch(url, {
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    const blob = await res.blob();

    const link = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.setAttribute("href", link);
    a.setAttribute("download", name);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
}