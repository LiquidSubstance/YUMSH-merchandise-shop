function hide_menu() {
    const side_menu = document.querySelector(".side-menu-content");
    const side_menu_wrapper = document.querySelector(".side-menu");
    const button = document.querySelector(".hide-menu");

    console.log(side_menu.style.display)
    if (side_menu.style.display === "none") {
        side_menu.style.display = "flex";
        button.textContent = "<";
        side_menu_wrapper.style.paddingLeft = "20px";
    } else {
        side_menu.style.display = "none";
        button.textContent = ">";
        side_menu_wrapper.style.paddingLeft = "0px";
    }
}