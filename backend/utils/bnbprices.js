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
exports.fetchBnbPrices = void 0;
var graphql_request_1 = require("graphql-request");
var endpoints_1 = require("../config/endpoints");
var BNB_PRICES = (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {\n    current: bundle(id: \"1\") {\n      bnbPrice\n    }\n    oneDay: bundle(id: \"1\", block: { number: $block24 }) {\n      bnbPrice\n    }\n    twoDay: bundle(id: \"1\", block: { number: $block48 }) {\n      bnbPrice\n    }\n    oneWeek: bundle(id: \"1\", block: { number: $blockWeek }) {\n      bnbPrice\n    }\n  }\n"], ["\n  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {\n    current: bundle(id: \"1\") {\n      bnbPrice\n    }\n    oneDay: bundle(id: \"1\", block: { number: $block24 }) {\n      bnbPrice\n    }\n    twoDay: bundle(id: \"1\", block: { number: $block48 }) {\n      bnbPrice\n    }\n    oneWeek: bundle(id: \"1\", block: { number: $blockWeek }) {\n      bnbPrice\n    }\n  }\n"])));
var fetchBnbPrices = function (block24, block48, blockWeek) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_1;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, graphql_request_1.request)(endpoints_1.INFO_CLIENT, BNB_PRICES, {
                        block24: block24,
                        block48: block48,
                        blockWeek: blockWeek
                    })];
            case 1:
                data = _j.sent();
                return [2 /*return*/, {
                        error: false,
                        bnbPrices: {
                            current: parseFloat((_b = (_a = data.current) === null || _a === void 0 ? void 0 : _a.bnbPrice) !== null && _b !== void 0 ? _b : '0'),
                            oneDay: parseFloat((_d = (_c = data.oneDay) === null || _c === void 0 ? void 0 : _c.bnbPrice) !== null && _d !== void 0 ? _d : '0'),
                            twoDay: parseFloat((_f = (_e = data.twoDay) === null || _e === void 0 ? void 0 : _e.bnbPrice) !== null && _f !== void 0 ? _f : '0'),
                            week: parseFloat((_h = (_g = data.oneWeek) === null || _g === void 0 ? void 0 : _g.bnbPrice) !== null && _h !== void 0 ? _h : '0')
                        }
                    }];
            case 2:
                error_1 = _j.sent();
                console.error('Failed to fetch BNB prices', error_1);
                return [2 /*return*/, {
                        error: true,
                        bnbPrices: undefined
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchBnbPrices = fetchBnbPrices;
var templateObject_1;
