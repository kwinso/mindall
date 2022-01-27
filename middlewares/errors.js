module.exports = async function (error, _, res, next) {
    if (process.env.NODE_ENV != "prod") {
        console.log(error.stack);
    }

    let status = 500;

    if (error.code)
        status = error.code;

    res.status(status).json({
        error: true,
        message: status == 500 ? "Ошибка сервера." : error.message,
    });
}