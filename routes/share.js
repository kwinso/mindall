const { Router } = require("express");
const { HttpError } = require("../httpError");
const db = require("../db");
const uniqid = require("uniqid");
const { createShareQR } = require("../functions/qr");
const router = Router();
const wrap = require('async-middleware').wrap;
const { getRandomCitate } = require("../functions/ad");


router.get("/:id", wrap(async (req, res) => {
    const { id } = req.params;

    if (id == "ad") {
        const citate = getRandomCitate();
        return res.status(200).json({
            input: citate,
            encodeMode: true
        });
    }

    const share = await db.Share.findOne({ id });

    if (!share) throw new HttpError("Ссылка не найдена. Возможно, она уже удалена.", 404);

    res.status(200).json({
        input: share.input,
        encodeMode: share.encodeMode
    })

}));

router.post("/", async (req, res) => {
    const { input, encodeMode } = req.body;

    if (!input || typeof (encodeMode) != "boolean") {
        throw new HttpError("Неправильные параметры для создания записи.", 400);
    }
    if (input.length > 1000) {
        throw new HttpError("Текст слишком большой", 400);
    }

    const id = uniqid();

    const share = new db.Share({
        input,
        encodeMode,
        id,
    });

    await share.save();
    const qr = await createShareQR(id);

    res.status(201).json({ id, qr });
});


module.exports = router;
