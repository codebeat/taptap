const moment = require("moment");
const Earnings = require("../models/Earnings");

function getSecondOfDayUTC(date_time = null) {
    const now = date_time !== null ? date_time : new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    const final_seconds = hours * 3600 + minutes * 60 + seconds;

    return final_seconds;
}

function findBatch(date_time = null) {
    const total_seconds_in_day = 24 * 3600;
    const number_of_batches = 8;
    const seconds_per_batch = total_seconds_in_day / number_of_batches;

    const seconds_of_day = getSecondOfDayUTC(date_time);
    const batch = Math.floor(seconds_of_day / seconds_per_batch) + 1;

    return batch;
}

function getCurrentDateFormatted() {
    var now = new Date();

    var year = now.getUTCFullYear();
    var month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // getUTCMonth() returns month index (0-11)
    var day = now.getUTCDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function getRequiredScore(miner_level) {
    if (miner_level === 1) {
        return [20000, "20k"];
    } else if (miner_level === 2) {
        return [100000, "100k"];
    } else if (miner_level === 3) {
        return [200000, "200k"];
    } else if (miner_level === 4) {
        return [500000, "500k"];
    } else if (miner_level === 5) {
        return [1000000, "1M"];
    } else {
        throw new Error(
            `miner_level not found for getRequiredScore(${miner_level})`
        );
    }
}

function getClaimScore(miner_level) {
    if (miner_level === 1) {
        return [10000, "10k"];
    } else if (miner_level === 2) {
        return [50000, "50k"];
    } else if (miner_level === 3) {
        return [75000, "75k"];
    } else if (miner_level === 4) {
        return [100000, "100k"];
    } else if (miner_level === 5) {
        return [150000, "150k"];
    } else {
        throw new Error(`miner_level not found for getClaimScore(${miner_level})`);
    }
}

async function upgrade(req, res, next) {
    var userid = req.user.id;

    var earnings = await Earnings.findOne({
        where: {
            userid: userid,
        },
    });

    if (earnings === null) {
        return next(`No earnings record found for ${userid}`);
    }

    let miner_level = !isNaN(parseInt(earnings.miner_level)) ?
        parseInt(earnings.miner_level) :
        0;
    let score = !isNaN(parseInt(earnings.tap_points)) ?
        parseInt(earnings.tap_points) :
        0;

    if (miner_level < 5) {
        let next_miner_level = miner_level + 1;
        const [required_score, score_in_text] = getRequiredScore(next_miner_level);
        if (score >= required_score) {
            score -= required_score;
            await earnings.update({
                tap_points: score,
                miner_level: next_miner_level,
            });
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                miner_level: next_miner_level,
                score: score,
                message: "Successfully upgraded",
            });
        } else {
            return next(
                `Insufficient balance for ${userid} to upgrade from ${miner_level} to ${next_miner_level}`
            );
        }
    } else {
        return next(`User Exceed upgrade level ${userid}`);
    }
}

async function claim(req, res, next) {
    var userid = req.user.id;

    var earnings = await Earnings.findOne({
        where: {
            userid: userid,
        },
    });

    if (earnings !== null) {
        let miner_level = !isNaN(parseInt(earnings.miner_level)) ?
            parseInt(earnings.miner_level) :
            0;
        let last_mine_date = earnings.last_mine_date;
        last_mine_date = last_mine_date !== null ? last_mine_date : null;
        let last_mine_batch =
            last_mine_date !== null ? findBatch(last_mine_date) : 0;
        let currrent_batch = findBatch();

        var claim = false;
        if (miner_level > 0) {
            if (last_mine_date === null) {
                claim = true;
            } else if (last_mine_date !== null) {
                let last_date = moment.utc(last_mine_date).format("YYYY-MM-DD");
                //TODO: need to change this function to moment
                let current_date = getCurrentDateFormatted();
                if (current_date > last_date) {
                    claim = true;
                } else if (
                    current_date == last_date &&
                    last_mine_batch < currrent_batch
                ) {
                    claim = true;
                }
            }
        }

        if (claim) {
            let score = !isNaN(parseInt(earnings.tap_points)) ?
                parseInt(earnings.tap_points) :
                0;

            const [claim_score, clain_score_text] = getClaimScore(miner_level);
            score += claim_score;
            last_mine_date = new Date();
            await earnings.update({
                tap_points: score,
                last_mine_date: last_mine_date,
            });
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                last_mine_date: last_mine_date,
                score: score,
                message: "Successfully claimed",
            });
        } else {
            return next(`Ivalid claim request for ${userid}`);
        }
    }

    return next(`No earnings record found for ${userid}`);
}

module.exports = {
    claim,
    upgrade,
};