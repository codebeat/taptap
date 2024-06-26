const TGUser = require('./TGUser');
const Earnings = require('./Earnings');

// Define associations
TGUser.hasOne(Earnings, { foreignKey: 'userid', sourceKey: 'userid' });
Earnings.belongsTo(TGUser, { foreignKey: 'userid', targetKey: 'userid' });

module.exports = {
    TGUser,
    Earnings,
};