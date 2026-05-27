async function get_user() {
    const token = localStorage.getItem("token");

    const res = await fetch("/get_user", {
        headers: {Authorization: `Bearer ${token}`}
    })
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        return;
    }
}