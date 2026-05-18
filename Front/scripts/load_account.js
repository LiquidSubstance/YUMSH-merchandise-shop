async function update_page(user) {
    const login_button = document.getElementById("open-login");
    const signup_button = document.getElementById("open-signup");
    const account_link = document.getElementById("account-link");
    login_button.style.display = "none";
    signup_button.style.display = "none";
    account_link.style.display = "block";
    account_link.textContent = user.login;
    account_link.href = "account_page.html";
    const ans = fetch("/get_user?login=" + user.login, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    const res = await ans;
    if (JSON.stringify(res.user.is_admin)) {
        const add_item_wrapper = document.querySelector(".add-item-wrapper")
        const add_item_page_wrapper = document.querySelector(".add-item-page-wrapper")
        add_item_wrapper.style.display = "block";
        add_item_page_wrapper.style.display = "block";
        const open_button = document.querySelector(".open-button");
        open_button.style.display = "block";
        const delete_buttons = document.querySelectorAll(".delete-filter-button");
        delete_buttons.forEach(delete_button => {
            delete_button.style.display = "flex";
        })
    }
}
window.onload = async () => {
    await load_filters();
    const user = localStorage.getItem("user");
    if (user) {
        update_page(JSON.parse(user));
    }
}