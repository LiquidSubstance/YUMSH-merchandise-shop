async function update_item_page(user) {
    const login_button = document.getElementById("open-login");
    const signup_button = document.getElementById("open-signup");
    const account_link = document.getElementById("account-link");
    login_button.style.display = "none";
    signup_button.style.display = "none";
    account_link.style.display = "block";
    account_link.textContent = user.login;
    account_link.href = "account_page.html";
    const ans = await fetch("/get_user?login=" + user.login, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    const res = await ans.json();
    if (JSON.stringify(res.user.is_admin)) {
        const open_const = document.querySelector(".open-attribute-constructor");
        const delete_button = document.querySelector(".delete-item-button");
        open_const.style.display = "block";
        delete_button.style.display = "block";
    }
}
window.onload = async () => {
    const user = localStorage.getItem("user");
    if (user) {
        update_item_page(JSON.parse(user));
    }
}