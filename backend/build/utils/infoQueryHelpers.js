"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeltaTimestamps = exports.multiQuery = void 0;
const date_fns_1 = require("date-fns");
const graphql_request_1 = require("graphql-request");
/**
 * Helper function to get large amount GrqphQL subqueries
 * @param queryConstructor constructor function that combines subqueries
 * @param subqueries individual queries
 * @param endpoint GraphQL endpoint
 * @param skipCount how many subqueries to fire at a time
 * @returns
 */
const multiQuery = (queryConstructor, subqueries, endpoint, skipCount = 1000) => __awaiter(void 0, void 0, void 0, function* () {
    let fetchedData = {};
    let allFound = false;
    let skip = 0;
    try {
        while (!allFound) {
            let end = subqueries.length;
            if (skip + skipCount < subqueries.length) {
                end = skip + skipCount;
            }
            const subqueriesSlice = subqueries.slice(skip, end);
            // eslint-disable-next-line no-await-in-loop
            const result = yield (0, graphql_request_1.request)(endpoint, queryConstructor(subqueriesSlice));
            fetchedData = Object.assign(Object.assign({}, fetchedData), result);
            allFound = Object.keys(result).length < skipCount || skip + skipCount > subqueries.length;
            skip += skipCount;
        }
        return fetchedData;
    }
    catch (error) {
        console.error('Failed to fetch info data', error);
        return null;
    }
});
exports.multiQuery = multiQuery;
/**
 * Returns UTC timestamps for 24h ago, 48h ago, 7d ago and 14d ago relative to current date and time
 */
const getDeltaTimestamps = () => {
    const utcCurrentTime = (0, date_fns_1.getUnixTime)(new Date()) * 1000;
    const t24h = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subDays)(utcCurrentTime, 1)));
    const t48h = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subDays)(utcCurrentTime, 2)));
    const t7d = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subWeeks)(utcCurrentTime, 1)));
    const t14d = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subWeeks)(utcCurrentTime, 2)));
    return [t24h, t48h, t7d, t14d];
};
exports.getDeltaTimestamps = getDeltaTimestamps;
