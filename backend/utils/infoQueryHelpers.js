"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getDeltaTimestamps = exports.multiQuery = void 0;
var date_fns_1 = require("date-fns");
var graphql_request_1 = require("graphql-request");
/**
 * Helper function to get large amount GrqphQL subqueries
 * @param queryConstructor constructor function that combines subqueries
 * @param subqueries individual queries
 * @param endpoint GraphQL endpoint
 * @param skipCount how many subqueries to fire at a time
 * @returns
 */
var multiQuery = function (queryConstructor, subqueries, endpoint, skipCount) {
    if (skipCount === void 0) { skipCount = 1000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fetchedData, allFound, skip, end, subqueriesSlice, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchedData = {};
                    allFound = false;
                    skip = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    _a.label = 2;
                case 2:
                    if (!!allFound) return [3 /*break*/, 4];
                    end = subqueries.length;
                    if (skip + skipCount < subqueries.length) {
                        end = skip + skipCount;
                    }
                    subqueriesSlice = subqueries.slice(skip, end);
                    return [4 /*yield*/, (0, graphql_request_1.request)(endpoint, queryConstructor(subqueriesSlice))];
                case 3:
                    result = _a.sent();
                    fetchedData = __assign(__assign({}, fetchedData), result);
                    allFound = Object.keys(result).length < skipCount || skip + skipCount > subqueries.length;
                    skip += skipCount;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, fetchedData];
                case 5:
                    error_1 = _a.sent();
                    console.error('Failed to fetch info data', error_1);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.multiQuery = multiQuery;
/**
 * Returns UTC timestamps for 24h ago, 48h ago, 7d ago and 14d ago relative to current date and time
 */
var getDeltaTimestamps = function () {
    var utcCurrentTime = (0, date_fns_1.getUnixTime)(new Date()) * 1000;
    var t24h = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subDays)(utcCurrentTime, 1)));
    var t48h = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subDays)(utcCurrentTime, 2)));
    var t7d = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subWeeks)(utcCurrentTime, 1)));
    var t14d = (0, date_fns_1.getUnixTime)((0, date_fns_1.startOfMinute)((0, date_fns_1.subWeeks)(utcCurrentTime, 2)));
    return [t24h, t48h, t7d, t14d];
};
exports.getDeltaTimestamps = getDeltaTimestamps;
