wrapper = document.querySelector(".catalogue");
class Filter {
    constructor(content, property) {
        this.content = content;
        this.property = property;
    }
    applyFilter(items) {
        let fitting = new Set();
        items.forEach(item => {
            let prop = this.property;
            if (item[prop] === this.content) {
                fitting.add(item);
            }
        });
        return fitting;
    };
    applyPriceFilter(items) {
        let fitting = new Set();
        if (this.property === "price") {
            items.forEach(item => {
                let prop = this.property;
                if (Number(item[prop]) <= Number(this.content[0]) && Number(item[prop]) >= Number(this.content[1])) {
                    fitting.add(item);
                }
            });
            return fitting;
        }
    }
}

async function uniteFilters(filters, wrapper) {
    const items_res = await fetch("/get_items", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    let items = Array.from(await items_res.json())
    let all_items = new Set(items);
    filters.sort((a, b) => {
        return a.property.localeCompare(b.property);
    })
    let j = 0;
    while (j < filters.length) {
        if (filters[j].property === "price") {
            let fitting = filters[j].applyPriceFilter(items);
            all_items = new Set([...all_items].filter(x => fitting.has(x)));
            j++;
            continue;
        }
        let fitting = filters[j].applyFilter(items);
        while (j < filters.length - 1 && filters[j].property === filters[j + 1].property) {
            j++;
            fitting = new Set([...filters[j].applyFilter(items), ...fitting]);
        }
        all_items = new Set([...all_items].filter(x => fitting.has(x)));
        j++;
    }
    console.log(all_items);
    wrapper.innerHTML = "";
    all_items.forEach((item) => {
        wrapper.appendChild(create_element(item));
    })
}
async function filter() {
    await load_filters();
    let raw_filters = Array.from(document.querySelectorAll(".filter-item-wrapper"))
    const data = await fetch("/get_filters", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    let db_filters = await data.json();
    let filters_map = new Map();
    for (const db_filter of db_filters) {
        let filter = new Filter(db_filter.content, db_filter.attribute);
        filters_map.set(String(db_filter.id), filter);
    }
    let all_filters = new Array();
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("filter-item")) {
            let filter_input = e.target;
            let current_filter_id = "";
            let i = 0;
            let flag = false;
            while (i < filter_input.id.length) {
                if (filter_input.id[i] === '-') {
                    flag = true;
                }
                if (flag && filter_input.id[i] !== '-' ) {
                    current_filter_id += filter_input.id[i];
                }
                i++;
            }
            let current_filter = filters_map.get(current_filter_id);
            if (filter_input.checked && !all_filters.includes(current_filter)) {
                all_filters.push(current_filter);
            } else if (!filter_input.checked) {
                all_filters = all_filters.filter(item => item !== current_filter);
            }
            console.log(all_filters);
            await uniteFilters(all_filters, wrapper);
        }
    });
    let price_down = document.getElementById("by-price-up");
    let price_up = document.getElementById("by-price-down");
    let price_filter = new Filter([1e9, -1], "price");
    let price_filter_wrapper = document.querySelector(".price");
    price_filter_wrapper.addEventListener("change", () => {
        all_filters = all_filters.filter(item => item !== price_filter);
        price_filter.content[0] = price_down.value;
        price_filter.content[1] = price_up.value;
        if (!price_down.value) {
            price_filter.content[0] = 1e9
        }
        if (!price_up.value) {
            price_filter.content[1] = -1;
        }
        all_filters.push(price_filter);
        uniteFilters(all_filters, wrapper);
    })
}
filter();