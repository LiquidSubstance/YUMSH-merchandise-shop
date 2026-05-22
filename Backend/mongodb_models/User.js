const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    login : {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    is_admin: {
        type: Boolean,
        required: true,
    },

    cart: {
        type: Map,
    }
})

module.exports = mongoose.model("User", UserSchema)