async function add_to_cart() {
    await get_user();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    const item_id = document.querySelector('.body').id
    if (user) {
        console.log(user);
        const ans = await fetch("/add_to_cart", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                login: user.login,
                id: item_id
            })
        })
        const res = await ans.json();
        console.log(res)
    }
}