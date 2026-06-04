const subscriptionService = require('../services/subscriptionService');

const GetUserSubscriptionInfo = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const info = await subscriptionService.getUserSubscriptionInfo(req.dbConnectionId, userId);
        res.status(200).json({ info });
    } catch (error) {
        next(error);
    }
};

const GetDashboardData = async (req, res, next) => {
    try {
        const { year, view } = req.query;
        const parsedYear = parseInt(year);
        const turnover = await subscriptionService.getTurnoverData(req.dbConnectionId, parsedYear, view);
        const activeMembersCount = await subscriptionService.getActiveMembersCount(req.dbConnectionId);
        const newMembersCount = await subscriptionService.getNewMembersCount(req.dbConnectionId);
        const lostMembersCount = await subscriptionService.getLostMembersCount(req.dbConnectionId);
        const growthRate = await subscriptionService.getGrowthRateData(turnover);
        const { averageCLV, averageLifetime } = await subscriptionService.getAverageCLVAndLifetime(req.dbConnectionId);
        const data = {
            turnover,
            activeMembersCount,
            newMembersCount,
            lostMembersCount,
            growthRate,
            averageCLV,
            averageLifetime
        };
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetUserSubscriptionInfo,
    GetDashboardData
};
