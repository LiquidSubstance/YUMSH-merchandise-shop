async function load_account_data(){
    const user = JSON.parse(localStorage.getItem("user"));
    const login_button = document.getElementById("open-login");
    const signup_button = document.getElementById("open-signup");
    const account_link = document.getElementById("account-link");
    login_button.style.display = "none";
    signup_button.style.display = "none";
    account_link.style.display = "block";
    account_link.textContent = user.login;
    account_link.href = "account_page.html";
    if (user) {
        const username = document.querySelector(".username");
        username.textContent = user.login;
    }
    const signout_button = document.querySelector(".signout-button");
    signout_button.onclick = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        location.replace("Catalogue.html")
    }
}
load_account_data();