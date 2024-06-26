const { sequelize } = require("../config/mysql-sequelize");
const { getUTCTime } = require("../utils/helperfun")
const { Op, col } = require("sequelize");

const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");

// TODO: need to complete
async function allrank(req, res, next) {
    try {
        const tgUser = req.user;

        if (!tgUser || !tgUser.id) {
            res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }




    } catch (error) {

    }

}


module.exports = {
    allrank
}