const login_open_button = document.getElementById("open-login")
const login_close_button = document.querySelector(".login-close-button")
const login_window = document.querySelector(".login-window");
login_open_button.onclick = () => {
    login_window.style.display = "flex";
}
login_close_button.onclick = () => {
    login_window.style.display = "none";
}
window.onclick = (event) => {
    if (event.target !== login_window) {
        login_window.style.display = "none";
    }
}

async function login() {
    const username = document.getElementById("input-name").value;
    const password = document.getElementById("input-password").value;

    const ans = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            login: username,
            password: password,
        }),
        headers: {"Content-Type": "application/json"}
    });

    const res = await ans.json();

    console.log(res);

    if (ans.ok) {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        login_window.style.display = "none";
        await update_page(res.user);
    } else {
        window.alert(res.message)
    }
}

const signup_open_button = document.getElementById("open-signup")
const signup_close_button = document.querySelector(".signup-close-button")
const signup_window = document.querySelector(".signup-window");
signup_open_button.onclick = () => {
    signup_window.style.display = "flex";
}
signup_close_button.onclick = () => {
    signup_window.style.display = "none";
}
window.onclick = (event) => {
    if (event.target !== signup_window) {
        signup_window.style.display = "none";
    }
}
async function signup() {
    const username = document.getElementById("signup-name").value;
    const password = document.getElementById("signup-password").value;
    const ans = await fetch("/signup", {
        method: "POST",
        body: JSON.stringify({
            login: username,
            password: password,
        }),
        headers: {"Content-Type": "application/json"}
    });
    const res = await ans.json();
    if (ans.ok) {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        login_window.style.display = "none";
        await update_page(res.user);
    } else {
        window.alert(res.message)
    }
}