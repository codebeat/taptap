var jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

var TGUser = require("../models/TGUser");
const Earnings = require("../models/Earnings");

function isMobileDevice(userAgent) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
    );
}

async function auth(req, res, next) {
    var user_agent = req.headers["user-agent"];
    var is_mobile = isMobileDevice(user_agent);
    if (user_agent === undefined || is_mobile !== true) {
        return res.status(403).json({
            statusCode: 403,
            status: "error",
            message: "Only available for mobile devices",
        });
    }

    try {
        var {
            id = null,
                username = "",
                first_name = "",
                last_name = "",
                language_code = "",
                referral_by = "",
                is_premium,
        } = req.body;

        if (!_.isNil(id)) {
            var tg_user = await TGUser.findOne({
                where: {
                    userid: id,
                },
            });

            var sync_data = {};

            if (tg_user === null) {
                referral_code = uuidv4().replace(/-/g, "");
                var tg_user_data = {
                    userid: id,
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    language_code: language_code,
                    referral_by: referral_by,
                    referral_code: referral_code,
                };

                if (is_premium === true) {
                    tg_user_data["tg_premium_user"] = "Y";
                }
                var create_tg_user = await TGUser.create(tg_user_data);
                if (!create_tg_user) {
                    throw new Error(
                        `TGUser insert failed in /api/tg/auth ${JSON.stringify(
              tg_user_data
            )}`
                    );
                } else {
                    const indata = { userid: id };
                    const newUser = await Earnings.create(indata);
                    if (!newUser) {
                        throw new Error(
                            `TGUser insert failed in /api/tg/auth ${JSON.stringify(
                tg_user_data
              )}`
                        );
                    }
                }

                sync_data = {
                    referral_code: referral_code,
                    miner_level: 0,
                    last_mine_date: "",
                    score: 0,
                };
            } else {
                //TODO: confirm this else block again
                var earnings = await Earnings.findOne({
                    where: {
                        userid: tg_user.userid,
                    },
                });
                sync_data = {
                    referral_code: tg_user.referral_code,
                    miner_level: earnings.miner_level === null ? 0 : earnings.miner_level,
                    last_mine_date: earnings.last_mine_date === null ? "" : earnings.last_mine_date,
                    score: earnings.tap_points,
                };
            }

            var token = jwt.sign({
                    id: id,
                    username: username,
                    referral_code: sync_data["referral_code"],
                },
                process.env.SECRET_KEY
            );
            sync_data["auth_token"] = token;

            return res.status(200).json({
                statusCode: 200,
                status: "success",
                sync_data: sync_data,
                message: "Successfully authenticated",
            });
        }

        return res.status(400).json({
            statusCode: 400,
            status: "error",
            message: "Invalid Data",
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    auth,
};