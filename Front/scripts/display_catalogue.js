function create_element(item) {
    let element = document.createElement("div");
    element.className = "catalogue-item";
    element.id = item.id;
    element.innerHTML = `
            <a href = "template.html?id=` + item.id + `">
                <img src="` + item.image_path + `" width="192" height="256" alt = "` + item.name + `">
                <div class = "item-content">
                    <h2>`+ item.name +`</h2>
                    <p class="price-tag"> `+ item.price +`₽ </p>
                </div>
            </a>
        `
    return element;
}
async function load() {
    const items_res = await fetch("/get_items", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    const wrapper = document.querySelector(".catalogue");
    wrapper.innerHTML = "";
    console.log(items_res);
    let all_catalogue_items = Array.from(await items_res.json());
    all_catalogue_items.forEach((item) => {
        wrapper.appendChild(create_element(item));
    });
}
load();