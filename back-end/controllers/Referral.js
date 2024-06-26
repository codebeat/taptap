const { sequelize } = require("../config/mysql-sequelize");
const { getUTCTime } = require("../utils/helperfun")
const { Op, col } = require("sequelize");

const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");

async function list(req, res, next) {

    try {

        const tgUser = req.user;

        if (tgUser == null && tgUser.id == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const { id: teleid, referral_code: refCode } = tgUser;

        const UserData = await TGUser.findOne({
            where: {
                userid: teleid,
                referral_code: refCode,
            },
        });

        if (!UserData && UserData == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        // TODO : need add pagination
        const friends = await TGUser.findAll({
            where: {
                referral_by: refCode,
            },
            order: [
                ["created_date", "DESC"]
            ],
            limit: 100,
            offset: 0,
        });

        // TODO : need to check game level
        const friendsData = friends.map((user) => ({
            id: user.id,
            first_name: user.first_name,
            username: user.username,
            claimed: user.ref_claim,
            Premium: user.tg_premium_user,
            gamelevel: user.game_level || "LVL 1"
        }));

        if (friendsData != null) {
            return res.status(200).json({ message: 'Success', data: { refCode: refCode, friends: friendsData } });
        } else {
            return res.status(200).json({ message: 'Success', data: { refCode: refCode, friends: [] } });
        }

    } catch (error) {

        console.error("Error fetching Friends list:", error);
        return next('An error occurred on the get list of referrals');

    }

}
async function claim(req, res, next) {
    try {
        const tgUser = req.user;
        const { friendID } = req.body;

        if (!tgUser || !tgUser.id || !tgUser.referral_code) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const refCode = tgUser.referral_code

        const earnDetails = await Earnings.findOne({
            where: {
                userid: tgUser.id,
            },
        });

        if (!earnDetails && earnDetails == null && !earnDetails.userid) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        const userDetails = await TGUser.findOne({
            where: {
                [Op.and]: [
                    { id: friendID },
                    { ref_claim: "N" },
                    { referral_by: refCode },
                ],
            },
        });

        if (!userDetails && userDetails == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const referral_score = userDetails.tg_premium_user === "Y" ? process.env.PREMIUM : process.env.NON_PREMIUM;

        const earnUpdata = {
            referral_score: parseInt(earnDetails.referral_score) + parseInt(referral_score),
            tap_score: parseInt(earnDetails.tap_score) + parseInt(referral_score)
        };
        const [updated] = await Earnings.update(earnUpdata, {
            where: {
                userid: tgUser.id,
            },
        });
        if (updated > 0) {
            const [isClaim] = await TGUser.update({ ref_claim: "Y" }, {
                where: {
                    [Op.and]: [
                        { id: friendID },
                        { ref_claim: "N" },
                        { referral_by: refCode },
                    ],
                },
            });
            if (isClaim > 0) {
                return res.status(200).json({ message: 'Success', data: { friendid: friendID, claimedPoint: referral_score } });
            } else {
                return res.status(409).json({ error: 'Conflict', message: 'Referral claim failed' });
            }
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Referral claim failed' });
        }
    } catch (error) {
        console.error("Error calim referral score:", error);
        next("An error occurred on calim referral score")
    }
}

async function claimAll(req, res, next) {
    try {
        const tgUser = req.user;
        const refCode = tgUser.referral_code
        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const earnDetails = await Earnings.findOne({ where: { "userid": tgUser.id } });

        if (!earnDetails || !earnDetails.userid) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const unclaimedUsers = await TGUser.findAll({
            where: {
                ref_claim: "N",
                referral_by: refCode
            },
        });

        if (unclaimedUsers.length === 0) {
            return res.status(200).json({ message: 'No unclaimed referrals found', data: [] });
        }

        let totalReferralScore = 0;

        unclaimedUsers.forEach(user => {
            const referralScore = user.tg_premium_user === "Y" ? parseInt(process.env.PREMIUM) : parseInt(process.env.NON_PREMIUM);
            totalReferralScore += referralScore;
        });

        const earnUpdate = {
            referral_score: parseInt(earnDetails.referral_score) + totalReferralScore,
            tap_score: parseInt(earnDetails.tap_score) + totalReferralScore
        };

        const [updated] = await Earnings.update(earnUpdate, { where: { userid: tgUser.id } });

        if (updated > 0) {
            const userIds = unclaimedUsers.map(user => user.userid);

            const [isClaim] = await TGUser.update({ ref_claim: "Y" }, {
                where: {
                    userid: {
                        [Op.in]: userIds
                    },
                    referral_by: refCode
                }
            });

            if (isClaim === userIds.length) {
                return res.status(200).json({ message: 'Success', data: { claimedPoints: totalReferralScore, claimedUsers: userIds } });
            } else {
                return res.status(422).json({ error: 'Unprocessable Entity', message: 'Some users could not be updated' });
            }
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Score update failed' });
        }
    } catch (error) {
        console.error("Error claiming all referral scores:", error);
        next("Error on claiming all referral scores")
    }
}

module.exports = {
    list,
    claim,
    claimAll
}