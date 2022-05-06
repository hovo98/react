"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Farm Auction
// Note: slightly different from AuctionStatus used throughout UI
var FarmAuctionContractStatus;
(function (FarmAuctionContractStatus) {
    FarmAuctionContractStatus[FarmAuctionContractStatus["Pending"] = 0] = "Pending";
    FarmAuctionContractStatus[FarmAuctionContractStatus["Open"] = 1] = "Open";
    FarmAuctionContractStatus[FarmAuctionContractStatus["Close"] = 2] = "Close";
})(FarmAuctionContractStatus = exports.FarmAuctionContractStatus || (exports.FarmAuctionContractStatus = {}));
