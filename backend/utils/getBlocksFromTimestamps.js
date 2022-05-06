"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.getBlocksFromTimestamps = void 0;
var graphql_request_1 = require("graphql-request");
var infoQueryHelpers_1 = require("../utils/infoQueryHelpers");
var endpoints_1 = require("../config/endpoints");
var getBlockSubqueries = function (timestamps) {
    return timestamps.map(function (timestamp) {
        return "t".concat(timestamp, ":blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ").concat(timestamp, ", timestamp_lt: ").concat(timestamp + 600, " }) {\n      number\n    }");
    });
};
var blocksQueryConstructor = function (subqueries) {
    return (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["query blocks {\n    ", "\n  }"], ["query blocks {\n    ", "\n  }"])), subqueries);
};
/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 */
var getBlocksFromTimestamps = function (timestamps, sortDirection, skipCount) {
    if (sortDirection === void 0) { sortDirection = 'desc'; }
    if (skipCount === void 0) { skipCount = 500; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fetchedData, sortingFunction, blocks, _i, _a, key;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ((timestamps === null || timestamps === void 0 ? void 0 : timestamps.length) === 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, (0, infoQueryHelpers_1.multiQuery)(blocksQueryConstructor, getBlockSubqueries(timestamps), endpoints_1.BLOCKS_CLIENT, skipCount)];
                case 1:
                    fetchedData = _b.sent();
                    sortingFunction = sortDirection === 'desc' ? function (a, b) { return b.number - a.number; } : function (a, b) { return a.number - b.number; };
                    blocks = [];
                    if (fetchedData) {
                        // eslint-disable-next-line no-restricted-syntax
                        for (_i = 0, _a = Object.keys(fetchedData); _i < _a.length; _i++) {
                            key = _a[_i];
                            if (fetchedData[key].length > 0) {
                                blocks.push({
                                    timestamp: key.split('t')[1],
                                    number: parseInt(fetchedData[key][0].number, 10)
                                });
                            }
                        }
                        // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
                        blocks.sort(sortingFunction);
                    }
                    return [2 /*return*/, blocks];
            }
        });
    });
};
exports.getBlocksFromTimestamps = getBlocksFromTimestamps;
var templateObject_1;
