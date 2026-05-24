function hide_header() {
    const header = document.querySelector(".header-wrapper");
    const login_wrapper = document.querySelector(".login-wrapper");
    const hide_button = document.querySelector(".hide-header-button");
    console.log(header.style.display);
    if (header.style.display !== "none") {
        hide_button.textContent = "∨";
        header.style.display = "none";
        login_wrapper.style.display = "none";
    } else {
        hide_button.textContent = "^";
        header.style.display = "flex";
        login_wrapper.style.display = "block";
    }
}