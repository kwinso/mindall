const { Router } = require("express");
const { encode, decode } = require("../functions/cipher");
const { HttpError } = require("../httpError");
const router = Router();

router.post("/encode", (req, res, next) => {
    if (!req.body?.original) {
        throw new HttpError("Сообщение для кодировки не указано.", 400);
    }
    const result = encode(req.body.original);

    res.json({ result });
});
router.post("/decode", (req, res) => {
    if (!req.body?.original) {
        throw new HttpError("Сообщение для декодировки не указано.", 400);
    }
    const result = decode(req.body.original);

    res.json({ result });
});

module.exports = router;