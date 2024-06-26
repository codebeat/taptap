const moment = require('moment');

function getUTCTime(param = null) {
    if (param === 'timestamp') {
        return moment().utc().valueOf(); // Returns the UTC timestamp
    } else if (param === 'datetime') {
        return moment().utc().format('YYYY-MM-DD HH:mm:ss');
    } else if (param === null) {
        return moment().utc();
    } else {
        return null;
    }
}

function convertDateTime(dateTimeString) {
    const formattedDateTime = moment(dateTimeString).utc().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = moment(dateTimeString).utc().valueOf();
    return {
        formattedDateTime: formattedDateTime,
        timestamp: timestamp
    };
}

module.exports = {
    getUTCTime,
    convertDateTime
};