var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var Task = require("../../controllers/Task");

router.get("/list", tgMiddleware.tgauth_required, Task.list);
router.post("/claim", tgMiddleware.tgauth_required, Task.claim);
router.post("/checkin", tgMiddleware.tgauth_required, Task.checkin);


module.exports = router;