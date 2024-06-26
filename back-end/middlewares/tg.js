const jwt = require("jsonwebtoken");

function tgauth_required(req, res, next) {
    const auth_header = req.headers["authorization"];
    if (!auth_header) {
        return res.status(401).json({
            status: "error",
            message: "unauthorized access: Invalid or missing token",
        });
    }

    const token = auth_header.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "unauthorized access: Invalid or missing token",
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: "error",
                message: "unauthorized access: invalid or missing token",
            });
        }

        req.user = user;

        next();
    });
}

module.exports = {
    tgauth_required,
};