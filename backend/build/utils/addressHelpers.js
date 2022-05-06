"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@pancakeswap/sdk");
const contracts_1 = __importDefault(require("../config/contracts"));
exports.getAddress = (address) => {
    const chainId = 56;
    return address[chainId] ? address[chainId] : address[sdk_1.ChainId.MAINNET];
};
exports.getMasterChefAddress = () => {
    return exports.getAddress(contracts_1.default.masterChef);
};
exports.getMulticallAddress = () => {
    return exports.getAddress(contracts_1.default.multiCall);
};
exports.getLotteryV2Address = () => {
    return exports.getAddress(contracts_1.default.lotteryV2);
};
exports.getPancakeProfileAddress = () => {
    return exports.getAddress(contracts_1.default.pancakeProfile);
};
exports.getPancakeRabbitsAddress = () => {
    return exports.getAddress(contracts_1.default.pancakeRabbits);
};
exports.getBunnyFactoryAddress = () => {
    return exports.getAddress(contracts_1.default.bunnyFactory);
};
exports.getClaimRefundAddress = () => {
    return exports.getAddress(contracts_1.default.claimRefund);
};
exports.getPointCenterIfoAddress = () => {
    return exports.getAddress(contracts_1.default.pointCenterIfo);
};
exports.getBunnySpecialAddress = () => {
    return exports.getAddress(contracts_1.default.bunnySpecial);
};
exports.getTradingCompetitionAddress = () => {
    return exports.getAddress(contracts_1.default.tradingCompetition);
};
exports.getEasterNftAddress = () => {
    return exports.getAddress(contracts_1.default.easterNft);
};
exports.getCakeVaultAddress = () => {
    return exports.getAddress(contracts_1.default.cakeVault);
};
exports.getPredictionsAddress = () => {
    return exports.getAddress(contracts_1.default.predictions);
};
exports.getChainlinkOracleAddress = () => {
    return exports.getAddress(contracts_1.default.chainlinkOracle);
};
exports.getBunnySpecialCakeVaultAddress = () => {
    return exports.getAddress(contracts_1.default.bunnySpecialCakeVault);
};
exports.getBunnySpecialPredictionAddress = () => {
    return exports.getAddress(contracts_1.default.bunnySpecialPrediction);
};
exports.getBunnySpecialLotteryAddress = () => {
    return exports.getAddress(contracts_1.default.bunnySpecialLottery);
};
exports.getFarmAuctionAddress = () => {
    return exports.getAddress(contracts_1.default.farmAuction);
};
