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
exports.fetchBnbPrices = void 0;
const graphql_request_1 = require("graphql-request");
const endpoints_1 = require("../config/endpoints");
const BNB_PRICES = (0, graphql_request_1.gql) `
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      bnbPrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      bnbPrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      bnbPrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      bnbPrice
    }
  }
`;
const fetchBnbPrices = (block24, block48, blockWeek) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const data = yield (0, graphql_request_1.request)(endpoints_1.INFO_CLIENT, BNB_PRICES, {
            block24,
            block48,
            blockWeek,
        });
        return {
            error: false,
            bnbPrices: {
                current: parseFloat((_b = (_a = data.current) === null || _a === void 0 ? void 0 : _a.bnbPrice) !== null && _b !== void 0 ? _b : '0'),
                oneDay: parseFloat((_d = (_c = data.oneDay) === null || _c === void 0 ? void 0 : _c.bnbPrice) !== null && _d !== void 0 ? _d : '0'),
                twoDay: parseFloat((_f = (_e = data.twoDay) === null || _e === void 0 ? void 0 : _e.bnbPrice) !== null && _f !== void 0 ? _f : '0'),
                week: parseFloat((_h = (_g = data.oneWeek) === null || _g === void 0 ? void 0 : _g.bnbPrice) !== null && _h !== void 0 ? _h : '0'),
            },
        };
    }
    catch (error) {
        console.error('Failed to fetch BNB prices', error);
        return {
            error: true,
            bnbPrices: undefined,
        };
    }
});
exports.fetchBnbPrices = fetchBnbPrices;
