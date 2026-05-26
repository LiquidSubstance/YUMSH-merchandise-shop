const express = require('express')
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Front")));
const upload = multer({ dest: '../Front/contents/' });
app.post("/upload_item_image", upload.single("file"), (req, res) => {
    const {name} = req.body;
    const src = req.file.path;
    const dst = path.join(__dirname, "../Front/contents/" + name + ".png");
    console.log(dst)
    fs.rename(src, dst, err => {
        if (err) {
            console.error(err);
        }
        res.json({ok: true});
    })
});
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database(path.join(__dirname, "../Data/database.db"));
database.run(`
    CREATE TABLE IF NOT EXISTS items (
        id          INTEGER PRIMARY KEY,
        name        TEXT,
        price       INTEGER,
        date        TEXT,
        description TEXT,
        type        TEXT,
        image_path  TEXT
    )                   
`);

app.post("/upload_item", (req, res) => {
    const {name, price, date, description, type, image_path} = req.body;
    const sql = `
        INSERT INTO items (name, price, date, description, type, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    database.run(sql, [name, price, date, description, type, image_path], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    });
});

app.get("/get_items", (req, res) => {
    database.all("SELECT * FROM items", (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    })
});

app.get("/get_item", (req, res) => {
   const {id} = req.query;
    database.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
       if (err) {
           console.error(err);
           return res.status(500).json({ error: err.message });
       }
       res.json(row);
   });
});

app.delete("/delete_item", (req, res) => {
    const {id} = req.body;
    database.get(`SELECT * FROM items WHERE id = ?`, [id], (err, row) => {
        if (!row) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        fs.rm("../Front/HTML_pages/" + row.image_path, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        })
    });
    database.run(`DELETE FROM items WHERE id = ?`, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    });
})
app.post("/add_attribute", (req, res) => {
    const {id, attribute, content} = req.body;
    const sql = `
        ALTER TABLE items
        ADD COLUMN ${attribute} TEXT DEFAULT ''
    `
    database.run(sql, err => {
        if (err) {
            console.error(err);
            res.json('Не удалось загрузить товар, такой аттрибут уже существует, попробуйте загрузить изменения через вкладку "Изменить Товар"')
        }
        database.run(`UPDATE items SET ${attribute} = ? WHERE id = ?`, [content, id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        });
    });
})
app.post("/update_attribute", (req, res) => {
    const {id, attribute, new_content} = req.body;
    database.get(`UPDATE items SET ${attribute} = ? WHERE id = ?`, [new_content, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    });
})
app.delete("/delete_attribute", (req, res) => {
    const {id, attribute} = req.body;
    database.run(`UPDATE items SET ${attribute} = ? WHERE id = ?`, ["", id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    });
})
database.run(`
    CREATE TABLE IF NOT EXISTS filters (
        id          INTEGER PRIMARY KEY,
        attribute        TEXT,
        name       TEXT,
        content        TEXT
    )                   
`);
app.post("/add_filter", (req, res) => {
    const {attribute, name, content} = req.body;
    const sql = `
        INSERT INTO filters (attribute, name, content) 
        VALUES (?, ?, ?)
    `;
    database.run(sql, [attribute, name, content],  function (err) {
        console.log(database);
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID
        });
    });
});
app.delete("/delete_filter", (req, res) => {
    const {id} = req.body;
    database.run(`DELETE FROM filters WHERE id = ?`, [id], (err, rows) => {
        console.log(id)
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    });
});
app.get("/get_filters", (req, res) => {
    database.all("SELECT * FROM filters", (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    })
});
app.get("/get_filter", (req, res) => {
    const {id} = req.query;
    database.get("SELECT * FROM filters WHERE id = ?",[id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    })
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./mongodb_models/User");
const readline = require("node:readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.question("U + P ?", (answer) => {
    mongoose.connect("mongodb+srv://LiquidSubstance:"+ answer +"@cluster0.e8c5egx.mongodb.net/?appName=Cluster0")
        .then(() => {
            console.log("Connected");
        })
        .catch(err => console.log(err));
})

app.post("/signup", async (req, res) => {
    const {login, password} = req.body;

    const candidate = await User.findOne({login});
    if (candidate) {
        return res.status(400).json({
            message: "Пользователь уже существует, попробуйте другой логин."
        })
    }

    const password_hash = await bcrypt.hash(password, 533);

    const user = new User({
        login,
        password: password_hash,
        is_admin: false,
        cart: new Map()
    });

    await user.save();
    console.log(user);
    const token = jwt.sign(
        {
            id: user._id,
        },
        "SECRET_KEY",
        {
            expiresIn: "24h"
        }
    );

    res.status(200).json({
        message: "Ок",
        token,
        user: {
            id: user._id,
            login: user.login,
        }
    })
})

app.post("/login", async (req, res) => {
    const {login, password} = req.body;

    const user = await User.findOne({ login });

    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        });
    }

    const ans = await bcrypt.compare(
        password,
        user.password,
    );

    if (!ans) {
        return res.status(400).json({
            message: "Неверный пароль."
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        "SECRET_KEY",
        {
            expiresIn: "24h"
        }
    );

    res.status(200).json({
        token,
        message: "Успешный вход.",
        user: {
            id: user._id,
            login: user.login,
        }
    });
})

app.get("/get_user", async (req, res) => {
    const {login} = req.query;
    const user = await User.findOne({login});
    if (!user) {
        console.log("Пользователь с таким логином не найден.")
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })

    }
    console.log(user);
    res.status(200).json({
        user: {
            id: user._id,
            login: user.login,
            is_admin: user.is_admin,
            cart: user.cart
        },
        message: "Пользователь получен"
    });
})

app.post("/make_admin", async (req, res) => {
    const {login} = req.body;
    const user = await User.findOne({login});
    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })
    }
    user.is_admin = true;
    await user.save();
    return res.status(200).json({
        message: "Пользователь " + login + " назначен администратором"
    });
})

app.post("/add_to_cart", async (req, res) => {
    const {login, id} = req.body;
    const user = await User.findOne({login});
    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })
    }
    if (user.cart.has(id)) {
        user.cart.set(id, user.cart.get(id) + 1);
    } else {
        user.cart.set(id, 1);
    }
    await user.save();
    console.log(user.cart);
    return res.status(200).json({
        message: "Товар с id " + id + " добавлен в корзину"
    });
})
app.post("/delete_from_cart", async (req, res) => {
    const {login, id} = req.body;
    const user = await User.findOne({login});
    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })
    }
    if (user.cart.has(id)) {
        if (user.cart.get(id) === 1) {
            user.cart.delete(id);
        } else {
            user.cart.set(id, user.cart.get(id) - 1);
        }
    } else {
        return res.status(400).json({
            message: "Товара с id " + id + " нет в корзине"
        })
    }
    await user.save();
    return res.status(200).json({
        message: "Товар с id " + id + " удален из корзины"
    });
})
app.post("/remove_from_cart", async (req, res) => {
    const {login, id} = req.body;
    const user = await User.findOne({login});
    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })
    }
    if (user.cart.has(id)) {
        user.cart.delete(id);
    } else {
        return res.status(400).json({
            message: "Товара с id " + id + " нет в корзине"
        })
    }
    await user.save();
    return res.status(200).json({
        message: "Товар с id " + id + " удален из корзины"
    });
})
app.post("/order", async (req, res) => {
    const {login} = req.body;
    const user = await User.findOne({login});
    if (!user) {
        return res.status(400).json({
            message: "Пользователь с таким логином не найден."
        })
    }
    user.cart = new Map();
    await user.save();
    return res.status(200).json({
        message: "Корзина очищена"
    })
})
app.listen(3000);