const { Op, col } = require("sequelize");
const { sequelize } = require("../config/mysql-sequelize");
const { format } = require("date-fns");

const Earnings = require("../models/Earnings");

const TGUser = require("../models/TGUser");

function today() {
    const DateTime = new Date();
    const today = format(DateTime, "yyyy-MM-dd HH:mm:ss");
    return today;
}

async function upscore(req, res, next) {
    try {
        const { points, remaning_energy, restore_time } = req.body;

        const tgUser = req.user;

        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const { id: teleid } = tgUser;

        if (!teleid) {
            return res.status(401).json({ message: "Invalid user" });
        }
        const userDbDetails = await Earnings.findOne({ where: { teleid } });

        //need to chcek
        // let temppoints = points && points >= 0 ? points : userDbDetails.tap_points

        const updata = {
            tap_points: points,
            remaning_energy: remaning_energy,
            restore_time: restore_time,
            modifiydate: today(),
        };

        if (userDbDetails) {
            const updated = await Earnings.update(updata, { where: { teleid } });

            if (updated) {
                return res.status(200).json({
                    isUpdate: true,
                    message: "Point updated successfully",
                    restore_time: today(),
                });
            } else {
                return res
                    .status(401)
                    .json({ isUpdate: false, message: "Point update failed", updated });
            }
        } else {
            const indata = {
                teleid: teleid,
                tap_points: parseInt(points),
                game_played_time: parseInt(timePlayed),
                game_deducted_points: parseInt(deductedPoints),
                createdate: new Date(),
            };
            const newUser = await Earnings.create(indata);
            if (newUser) {
                return res
                    .status(200)
                    .json({ isUpdate: true, message: "Point inserted successfully" });
            } else {
                return res
                    .status(401)
                    .json({ isUpdate: false, message: "Point insertion failed" });
            }
        }
    } catch (error) {
        console.error("Error updating points:", error);
        return res
            .status(500)
            .json({ isUpdate: false, message: "Internal server error" });
    }
}

async function getscore(req, res, next) {
    try {
        const { tid } = req.body;

        if (tid) {
            const userDbDetails = await Earnings.findOne({
                where: { teleid: tid },
            });

            if (userDbDetails) {
                const value = {
                    checkin_points: userDbDetails.checkin_points,
                    game_deducted_points: userDbDetails.game_deducted_points,
                    game_played_time: userDbDetails.game_played_time,
                    miner_points: userDbDetails.miner_points,
                    ref_points: userDbDetails.ref_points,
                    points: userDbDetails.tap_points,
                    restore_time: userDbDetails.restore_time,
                    energy: userDbDetails.remaning_energy,
                    game_level: userDbDetails.miner_level,
                };
                res.status(200).json({ isthere: true, message: "success", value });
            } else {
                res.status(200).json({ isthere: false, message: "no data" });
            }
        } else {
            res.status(401).json({ message: "Invalid user" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return res
            .status(500)
            .json({ isUpdate: false, message: "Internal server error" });
    }
}
//not over
async function sync(req, res, next) {
    try {
        const { tid } = req.body;

        if (tid) {
            const userDbDetails = await Earnings.findOne({
                where: { teleid: tid },
            });

            if (userDbDetails) {
                const value = {
                    teleid: userDbDetails.teleid,
                    checkin_points: userDbDetails.checkin_points,
                    game_deducted_points: userDbDetails.game_deducted_points,
                    game_played_time: userDbDetails.game_played_time,
                    miner_points: userDbDetails.miner_points,
                    ref_points: userDbDetails.ref_points,
                    tap_points: userDbDetails.tap_points,
                };
                res.status(200).json({ isthere: true, message: "success", value });
            } else {
                res.status(200).json({ isthere: false, message: "no data" });
            }
        } else {
            res.status(401).json({ message: "Invalid user" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return res
            .status(500)
            .json({ isUpdate: false, message: "Internal server error" });
    }
}

async function getref(req, res, next) {
    try {

        const tgUser = req.user;

        if (tgUser == null) {
            return res.status(401).json({ error: "unauth" });
        }

        const { id: TID, referral_code: REF_CODE } = tgUser;

        const tgUserData = await TGUser.findOne({
            where: {
                userid: TID,
                referral_code: REF_CODE,
            },
        });

        if (!tgUserData && tgUserData == null) {
            return res.status(401).json({ error: "Invalid user" });
        }

        const friends = await TGUser.findAll({
            where: {
                referral_by: REF_CODE,
            },
            order: [
                ["created_date", "DESC"]
            ],
            limit: req.query.limit || 100,
            offset: req.query.offset || 0,
        });

        const friendsData = friends.map((user) => ({
            id: user.id,
            first_name: user.first_name,
            username: user.username,
            isClaimed: user.ref_claim,
            isPremium: user.tg_premium_user,
            gamelevel:user.game_level||"LVL 1"
        }));

        return res.status(200).json({
            isthere: true,
            message: "success",
            value: {
                refCode: REF_CODE,
                friends: friendsData,
            },
        });
    } catch (error) {
        console.error("Error fetching grouped users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function refclaim(req, res, next) {
    try {
        const tgUser = req.user;
        const { friendID, refCode } = req.body;
        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const earnDetails = await Earnings.findOne({
            where: {
                teleid: tgUser.id,
            },
        });

        if (!earnDetails && earnDetails == null && !earnDetails.teleid) {
            return res.status(401).json({ error: "Invalid user" });
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
            return res.status(401).json({ error: "Invalid calim" });
        }
        const REF_POINT =
            userDetails.tg_premium_user === "Y" ?
            process.env.PREMIUM :
            process.env.NON_PREMIUM;
        const updata = {
            ref_points: parseInt(earnDetails.ref_points) + parseInt(REF_POINT),
            tap_points: parseInt(earnDetails.tap_points) + parseInt(REF_POINT)
        };
        const updated = await Earnings.update(updata, {
            where: {
                teleid: tgUser.id,
            },
        });
        if (updated) {
            const isClaim = await TGUser.update({ ref_claim: "Y" }, {
                where: {
                    [Op.and]: [
                        { id: friendID },
                        { ref_claim: "N" },
                        { referral_by: refCode },
                    ],
                },
            });

            if (isClaim) {
                return res.status(200).json({ icalimed: true, message: "success" ,refpoint:REF_POINT});
            } else {
                return res
                    .status(401)
                    .json({ icalimed: false, message: "claim update fail" });
            }
        } else {
            return res.status(401).json({ icalimed: false, message: "fail" });
        }
    } catch (e) {
        console.error("Error ref calim:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
async function upCheckin(req, res, next) {
    try {
        const tgUser = req.user;
        const { teleid, tasktype } = req.body;
        if (!tgUser || !tgUser.id || teleid != tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const earnDetails = await Earnings.findOne({
            where: {
                teleid: tgUser.id,
            },
        });

        if (!earnDetails) {
            return res.status(401).json({ error: "Invalid user" });
        }

        const dbTask = earnDetails.task ? earnDetails.task : "";

        switch (tasktype) {
            case "daily":
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);

                earnDetails.current_streak = parseInt(earnDetails.current_streak, 10);
                earnDetails.checkin_points = parseInt(earnDetails.checkin_points, 10);

                let lastLoginDate = null;
                if (earnDetails.recent_login) {
                    lastLoginDate = new Date(earnDetails.recent_login);
                    lastLoginDate.setUTCHours(0, 0, 0, 0);
                }

                const daysDifference = lastLoginDate ? (today - lastLoginDate) / (1000 * 3600 * 24) : null;

                let rewardPoints = 0;
                let rewardDay = 0;

                if (lastLoginDate === null || daysDifference > 3) {
                    // First login or login after more than 3 days
                    earnDetails.current_streak = 1;
                    rewardPoints = 5000;
                    rewardDay = 1;
                } else if (daysDifference === 0) {
                    // Already logged in today, no additional points
                    rewardPoints = 0;
                    rewardDay = earnDetails.current_streak;
                } else if (daysDifference === 1) {
                    // Consecutive login
                    earnDetails.current_streak += 1;
                    rewardDay = earnDetails.current_streak;
                    rewardPoints = earnDetails.current_streak * 5000;
                } else if (daysDifference > 1 && daysDifference <= 3) {
                    // Login after a short break (1-3 days)
                    earnDetails.current_streak = 1;
                    rewardPoints = 5000;
                    rewardDay = 1;
                }

                earnDetails.checkin_points += rewardPoints;
                earnDetails.recent_login = today;

                const updata = {
                    current_streak: earnDetails.current_streak,
                    checkin_points: earnDetails.checkin_points,
                    recent_login: earnDetails.recent_login,
                };

                const updated = await Earnings.update(updata, {
                    where: {
                        teleid: tgUser.id,
                    },
                });

                console.log("ise updtaed",updated)
                if (updated) {
                    return res.status(200).json({
                        isCheckin: true,
                        message: "success",
                        value: { streak: rewardDay, points: rewardPoints },
                    });
                } else {
                    return res
                        .status(401)
                        .json({ isCheckin: false, message: "checkin fail", dailycheckin: true });
                }

                break;

            case "x":
                let newTaskX = dbTask.includes("X") ? dbTask : `${dbTask}|X`;
                const upX = {
                    task: newTaskX,
                    task_points: parseInt(earnDetails.task_points) + 10000,
                    tap_points: parseInt(earnDetails.tap_points) + 10000,
                };

                const updatedx = await Earnings.update(upX, {
                    where: {
                        teleid: tgUser.id,
                    },
                });

                if (updatedx) {
                    return res.status(200).json({ isCheckin: true, message: "success" });
                } else {
                    return res
                        .status(401)
                        .json({ isCheckin: false, message: "checkin fail" });
                }

                break;

            case "telegram":
                let newTaskT = dbTask.includes("T") ? dbTask : `${dbTask}|T`;
                const uptg = {
                    task: newTaskT,
                    task_points: parseInt(earnDetails.task_points) + 10000,
                    tap_points: parseInt(earnDetails.tap_points) + 10000,
                };

                const updatedtg = await Earnings.update(uptg, {
                    where: {
                        teleid: tgUser.id,
                    },
                });

                if (updatedtg) {
                    return res.status(200).json({ isCheckin: true, message: "success" });
                } else {
                    return res
                        .status(401)
                        .json({ isCheckin: false, message: "checkin fail" });
                }

                break;
            case "ime":
                let newTaskime = dbTask.includes("IME") ? dbTask : `${dbTask}|IME`;
                const upime = {
                    task: newTaskime,
                    task_points: parseInt(earnDetails.task_points) + 10000,
                    tap_points: parseInt(earnDetails.tap_points) + 10000,
                };

                const updatedime = await Earnings.update(upime, {
                    where: {
                        teleid: tgUser.id,
                    },
                });

                if (updatedime) {
                    return res.status(200).json({ isCheckin: true, message: "success" });
                } else {
                    return res
                        .status(401)
                        .json({ isCheckin: false, message: "checkin fail" });
                }

                break;
            case "telecommunity":
                let newTasktc = dbTask.includes("TC") ? dbTask : `${dbTask}|TC`;
                const uptc = {
                    task: newTasktc,
                    task_points: parseInt(earnDetails.task_points) + 10000,
                    tap_points: parseInt(earnDetails.tap_points) + 10000,
                };

                const updatedtc = await Earnings.update(uptc, {
                    where: {
                        teleid: tgUser.id,
                    },
                });
                

                if (updatedtc) {
                    return res.status(200).json({ isCheckin: true, message: "success" });
                } else {
                    return res
                        .status(401)
                        .json({ isCheckin: false, message: "checkin fail" });
                }

                break;

            default:
                break;
        }
    } catch (e) {
        console.error("Error ref calim:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getCheckin(req, res, next) {
    try {
        const tgUser = req.user;
        const { tid, tasktype } = req.body;

        if (!tgUser || !tgUser.id || tid != tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const earnDetails = await Earnings.findOne({
            where: {
                teleid: tid,
            },
        });

        if (!earnDetails) {
            return res.status(401).json({ error: "Invalid user" });
        }

        earnDetails.current_streak = parseInt(earnDetails.current_streak, 10);
        earnDetails.checkin_points = parseInt(earnDetails.checkin_points, 10);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let lastLoginDate = null;
        if (earnDetails.recent_login) {

            lastLoginDate = new Date(earnDetails.recent_login);
            lastLoginDate.setUTCHours(0, 0, 0, 0);

        }

        const daysDifference = lastLoginDate ? (today - lastLoginDate) / (1000 * 3600 * 24) : null;

        let rewardPoints = 0;
        let rewardDay = 0;
        let dailycheckin = false;


        if (lastLoginDate === null || daysDifference > 3) {
            // First login or login after more than 3 days
            rewardPoints = 5000;
            rewardDay = 1;
            earnDetails.current_streak = 1;
            dailycheckin = true;
        } else if (daysDifference === 0 ) {
            // Already logged in today
            rewardPoints = 0;
            rewardDay = earnDetails.current_streak;
            dailycheckin = false;
        } else if (daysDifference === 1) {
            // Consecutive login
            earnDetails.current_streak += 1;
            rewardDay = earnDetails.current_streak;
            rewardPoints = earnDetails.current_streak * 5000;


            dailycheckin = true;
        } else if (daysDifference > 1 && daysDifference <= 3) {
            // Login after a short break (1-3 days)
            rewardPoints = 5000;
            rewardDay = 1;
            earnDetails.current_streak = 1;
            dailycheckin = true;
        }

        const otherTasklist = earnDetails && earnDetails.task ? earnDetails.task.split('|') : [];

        const taskDoneList = {
            dailycheckin,
            X: otherTasklist.includes("X"),
            T: otherTasklist.includes("T"),
            ime: otherTasklist.includes("IME"),
            telecom:otherTasklist.includes("TC"),
        };

        return res.status(200).json({
            isCheckin: true,
            message: "success",
            value: {
                streak: earnDetails.current_streak,
                points: rewardPoints,
                todayRewardDay: rewardDay,
            },
            taskDoneList,
        });
    } catch (e) {
        console.error("Error ref calim:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}


async function getAllUserRank(req, res, next) {
    try {
        const tgUser = req.user;
        const { tid } = req.body;

        let userPosition = null;
        let specificUserDetails = null;

        if (!tgUser || !tgUser.id || tid != tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const [results, metadata] = await sequelize.query("SELECT e.tap_points, t.username, e.game_level, e.id, t.first_name from tg_users as t JOIN earnings as e ON t.userid=e.teleid and e.tap_points !=0 order by e.tap_points desc;");
        const topUsers = results;

        if (!topUsers) {
            return res.status(401).json({ error: "Invalid user" });
        }

        const topplayers = topUsers.map((user) => ({
            id: user.id,
            firstname: user.first_name,
            username: user.username,
            overallPoints: user.tap_points,
            gameLevel: user.game_level,
        }));
        if (tid) {
            const userInTop = topplayers.find((player) => player.id === tid);
            if (!userInTop) {
                const [results1, metadata1] = await sequelize.query(`SELECT e.tap_points, t.username, e.game_level, e.id, t.first_name from tg_users as t JOIN earnings as e ON t.userid=e.teleid where t.userid='${tid}' order by e.tap_points desc;`);
                const specificUser = results1;

                if (specificUser.length > 0) {
                    specificUserDetails = {
                        id: specificUser[0].id,
                        firstname: specificUser[0].first_name,
                        username: specificUser[0].username,
                        overallPoints: specificUser[0].tap_points,
                        gameLevel: specificUser[0].game_level,
                    };

                    const userRank = await Earnings.count({
                        where: {
                            tap_points: {
                                [Op.gt]: specificUser[0].tap_points,
                            },
                        },
                    });
                    userPosition = userRank + 1;
                }
            }
        }

        return res.status(200).json({
            isthere: true,
            message: "success",
            value: { topplayers, specificUserDetails, userPosition },
        });
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    upscore,
    getscore,
    getref,
    refclaim,
    getCheckin,
    upCheckin,
    getAllUserRank,
};