"use strict";
exports.__esModule = true;
exports.getChangeForPeriod = exports.getPercentChange = exports.getAmountChange = void 0;
/**
 * Get increase/decrease of value compared to the previous value (e.g. 24h volume compared to 24h volume the day before )
 * @param valueNow - more recent value
 * @param valueBefore - value to compare with
 */
var getAmountChange = function (valueNow, valueBefore) {
    if (valueNow && valueBefore) {
        return valueNow - valueBefore;
    }
    if (valueNow) {
        return valueNow;
    }
    return 0;
};
exports.getAmountChange = getAmountChange;
/**
 * Get increase/decrease of value compared to the previous value as a percentage
 * @param valueNow - more recent value
 * @param valueBefore - value to compare with
 */
var getPercentChange = function (valueNow, valueBefore) {
    if (valueNow && valueBefore) {
        return ((valueNow - valueBefore) / valueBefore) * 100;
    }
    return 0;
};
exports.getPercentChange = getPercentChange;
/**
 * Given current value and value 1 and 2 periods (e.g. 1day + 2days, 1week - 2weeks) returns the amount change for latest period
 * and percentage change compared to the previous period.
 * @param valueNow - current value
 * @param valueOnePeriodAgo - value 1 period ago (e.g. 1 day or 1 week ago), period unit must be same as valueTwoPeriodsAgo
 * @param valueTwoPeriodsAgo - value 2 periods ago (e.g. 2 days or 2 weeks ago), period unit must be same as valueOnePeriodAgo
 * @returns amount change for the latest period and percetage change compared to previous period
 */
var getChangeForPeriod = function (valueNow, valueOnePeriodAgo, valueTwoPeriodsAgo) {
    var currentPeriodAmount = (0, exports.getAmountChange)(valueNow, valueOnePeriodAgo);
    var previousPeriodAmount = (0, exports.getAmountChange)(valueOnePeriodAgo, valueTwoPeriodsAgo);
    var percentageChange = (0, exports.getPercentChange)(currentPeriodAmount, previousPeriodAmount);
    return [currentPeriodAmount, percentageChange];
};
exports.getChangeForPeriod = getChangeForPeriod;
