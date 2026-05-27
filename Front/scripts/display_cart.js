async function create_cart_element(id, quantity, cnt) {
    const item = await fetch("/get_item?id="+id, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    const data = await item.json();
    cnt.cnt += Number(data.price) * Number(quantity);
    let cart_item = document.createElement("div");
    cart_item.className = "cart-item";
    cart_item.innerHTML = `
        <a href="template.html?id=`+String(id)+`">
            <img alt = "`+ data.name +`" src="`+ data.image_path +`">
        </a>
        <p>`+ data.name +`</p>
        <p>` + data.price + `</p>
        <p>x` + quantity + `</p>
        <button class = "add-button" id = "add-`+data.id+`">+</button>
        <button class = "remove-button" id = "remove-`+data.id+`">-</button>
        <button class = "full-remove-button" id = "remove-`+data.id+`">Удалить</button>
    `
    return cart_item;
}
async function load_cart(){
    await get_user();
    const cart = document.querySelector(".cart-wrapper");
    const user = JSON.parse(localStorage.getItem("user"));
    const ans = await fetch("/get_user?login=" + user.login, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    cart.innerHTML = "";
    const total_price = document.querySelector(".total-price");
    let cnt = {cnt : 0};
    const data = await ans.json();
    const cart_content = new Map(Object.entries(data.user.cart));
    for (let id of cart_content.keys()) {
        const element = await create_cart_element(id, cart_content.get(id), cnt);
        cart.appendChild(element);
    }
    total_price.textContent = "Итого: " + String(cnt.cnt);
}
const user = JSON.parse(localStorage.getItem("user"));
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-button")) {
        let id = "";
        let i = 0;
        let flag = false;
        while (i < e.target.id.length) {
            if (e.target.id[i] === '-') {
                flag = true;
            }
            if (flag && e.target.id[i] !== '-' ) {
                id += e.target.id[i];
            }
            i++;
        }
        const ans = await fetch("/add_to_cart", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: id,
                login: user.login,
            })
        })
        await load_cart();
    }
    if (e.target.classList.contains("remove-button")) {
        let id = "";
        let i = 0;
        let flag = false;
        while (i < e.target.id.length) {
            if (e.target.id[i] === '-') {
                flag = true;
            }
            if (flag && e.target.id[i] !== '-' ) {
                id += e.target.id[i];
            }
            i++;
        }
        const ans = await fetch("/delete_from_cart", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: id,
                login: user.login,
            })
        })
        await load_cart();
    }
    if (e.target.classList.contains("full-remove-button")) {
        let id = "";
        let i = 0;
        let flag = false;
        while (i < e.target.id.length) {
            if (e.target.id[i] === '-') {
                flag = true;
            }
            if (flag && e.target.id[i] !== '-' ) {
                id += e.target.id[i];
            }
            i++;
        }
        const ans = await fetch("/remove_from_cart", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: id,
                login: user.login,
            })
        })
        await load_cart();
    }
    if (e.target.classList.contains("order-button")) {
        const ans = await fetch("/order", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                login: user.login,
            })
        })
    }
})
load_cart();