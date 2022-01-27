const { Router } = require("express");
const { HttpError } = require("../httpError");
const db = require("../db");
const uniqid = require("uniqid");
const { createShareQR } = require("../functions/qr");
const router = Router();
const wrap = require('async-middleware').wrap

router.get("/:id", wrap(async (req, res) => {
    const { id } = req.params;
    const share = await db.Share.findOne({ id });

    if (!share) throw new HttpError("Ссылка не найдена. Возможно, она уже удалена.", 404);

    res.status(200).json({
        originalText: share.originalText,
        isEncoding: share.isEncoding
    })

}));

router.post("/", async (req, res) => {
    const { originalText, isEncoding } = req.body;

    if (!originalText || !isEncoding) {
        throw new HttpError("Неправильные параметры для создания записи.", 400);
    }
    if (originalText.length > 1000) {
        throw new HttpError("Текст слишком большой", 400);
    }

    const id = uniqid();

    const share = new db.Share({
        originalText,
        isEncoding,
        id,
    });

    await share.save();
    const qr = await createShareQR(id);

    res.status(201).json({ id, qr });
});


module.exports = router;