const express = require("express");
const router = express.Router();

const gameController = require("../../controllers/game");
const tgMiddleware = require("../../middlewares/tg");

// Use POST for routes that accept request body data
router.post("/upscore", tgMiddleware.tgauth_required, gameController.upscore);
router.post("/getscore", tgMiddleware.tgauth_required, gameController.getscore);
router.post("/getref", tgMiddleware.tgauth_required, gameController.getref);
router.post("/refclaim", tgMiddleware.tgauth_required, gameController.refclaim);
router.post("/getcheckin", tgMiddleware.tgauth_required, gameController.getCheckin);
router.post("/upcheckin", tgMiddleware.tgauth_required, gameController.upCheckin);
router.post("/usersrank", tgMiddleware.tgauth_required, gameController.getAllUserRank);



module.exports = router;