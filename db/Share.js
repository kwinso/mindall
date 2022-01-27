const { Schema, model } = require("mongoose");

const ShareSchema = new Schema({
    originalText: {
        type: String,
        required: true
    },
    isEncoding: {
        type: Boolean,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, expires: '5m', default: Date.now }
});

module.exports = model("Share", ShareSchema);