const { Schema, model } = require("mongoose");

const ShareSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    encodeMode: {
        type: Boolean,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, expires: '7d', default: Date.now }
});

module.exports = model("Share", ShareSchema);