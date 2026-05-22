async function create_cart_element(id, quantity) {
    const item = await fetch("/get_item?id="+id, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    const data = await item.json();
    let cart_item = document.createElement("div");
    cart_item.className = "cart-item";
    cart_item.innerHTML = `
        <img src="`+ data.image_path +`>
        <p>`+ data.name +`</p>
        <p>` + data.price + `</p>
        <p>x` + quantity + `</p>
    `
    return cart_item;
}
async function load_cart(){
    const cart = document.querySelector(".cart-wrapper");
    const user = JSON.parse(localStorage.getItem("user"));
    const ans = await fetch("/get_user?login=" + user.login, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    const data = await ans.json();
    console.log(data);
    for (let id of data.user.cart.keys()) {
        const element = await create_cart_element(id, data.user.cart[id]);
        cart.appendChild(element);
    }
}
load_cart();