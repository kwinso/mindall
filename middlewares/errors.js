module.exports = function (error, _, res) {
    if (process.env.NODE_ENV != "prod") {
        console.log(error.stack);
    }
    if (error.code)
        res.status(error.code);
    else res.status(500);

    res.json({
        error: true,
        message: error.message,
    });
}