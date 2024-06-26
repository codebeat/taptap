var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dot_env = require("dotenv");
var moment = require("moment");

dot_env.config();
var apiRouter = require("./routes/api/Main");
var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.disable('etag'); // for disable node If-None-Match comparing 

// app.get('*', function(req, res) {
//     res.render('maintenance');
// });

app.use("/api", apiRouter);

//404 handler
app.use(function(req, res, next) {
    return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Not found",
    });
});


//500 handler
app.use(function(err, req, res, next) {
    console.log(
        "err",
        err,
        "timestamp: ",
        moment().utc().format("YYYY-MM-DD HH:mm:ss")
    );
    return res.status(err.status || 500).json({
        statusCode: 500,
        status: "error",
        message: "Internal server error",
    });
});


module.exports = app;