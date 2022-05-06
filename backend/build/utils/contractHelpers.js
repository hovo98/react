"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const providers_1 = require("../utils/providers");
const pools_1 = __importDefault(require("../config/pools"));
const types_1 = require("../config/types");
const tokens_1 = __importDefault(require("../config/tokens"));
// Addresses
const addressHelpers_1 = require("./addressHelpers");
// ABI
const pancakeProfile_json_1 = __importDefault(require("../config/abi/pancakeProfile.json"));
const pancakeRabbits_json_1 = __importDefault(require("../config/abi/pancakeRabbits.json"));
const bunnyFactory_json_1 = __importDefault(require("../config/abi/bunnyFactory.json"));
const bunnySpecial_json_1 = __importDefault(require("../config/abi/bunnySpecial.json"));
const erc20_json_1 = __importDefault(require("../config/abi/erc20.json"));
const erc721_json_1 = __importDefault(require("../config/abi/erc721.json"));
const lpToken_json_1 = __importDefault(require("../config/abi/lpToken.json"));
const cake_json_1 = __importDefault(require("../config/abi/cake.json"));
const ifoV1_json_1 = __importDefault(require("../config/abi/ifoV1.json"));
const ifoV2_json_1 = __importDefault(require("../config/abi/ifoV2.json"));
const pointCenterIfo_json_1 = __importDefault(require("../config/abi/pointCenterIfo.json"));
const lotteryV2_json_1 = __importDefault(require("../config/abi/lotteryV2.json"));
const masterchef_json_1 = __importDefault(require("../config/abi/masterchef.json"));
const sousChef_json_1 = __importDefault(require("../config/abi/sousChef.json"));
const sousChefV2_json_1 = __importDefault(require("../config/abi/sousChefV2.json"));
const sousChefBnb_json_1 = __importDefault(require("../config/abi/sousChefBnb.json"));
const claimRefund_json_1 = __importDefault(require("../config/abi/claimRefund.json"));
const tradingCompetition_json_1 = __importDefault(require("../config/abi/tradingCompetition.json"));
const easterNft_json_1 = __importDefault(require("../config/abi/easterNft.json"));
const cakeVault_json_1 = __importDefault(require("../config/abi/cakeVault.json"));
const predictions_json_1 = __importDefault(require("../config/abi/predictions.json"));
const chainlinkOracle_json_1 = __importDefault(require("../config/abi/chainlinkOracle.json"));
const Multicall_json_1 = __importDefault(require("../config/abi/Multicall.json"));
const bunnySpecialCakeVault_json_1 = __importDefault(require("../config/abi/bunnySpecialCakeVault.json"));
const bunnySpecialPrediction_json_1 = __importDefault(require("../config/abi/bunnySpecialPrediction.json"));
const bunnySpecialLottery_json_1 = __importDefault(require("../config/abi/bunnySpecialLottery.json"));
const farmAuction_json_1 = __importDefault(require("../config/abi/farmAuction.json"));
const getContract = (abi, address, signer) => {
    const signerOrProvider = signer !== null && signer !== void 0 ? signer : providers_1.simpleRpcProvider;
    return new ethers_1.ethers.Contract(address, abi, signerOrProvider);
};
exports.getBep20Contract = (address, signer) => {
    return getContract(erc20_json_1.default, address, signer);
};
exports.getErc721Contract = (address, signer) => {
    return getContract(erc721_json_1.default, address, signer);
};
exports.getLpContract = (address, signer) => {
    return getContract(lpToken_json_1.default, address, signer);
};
exports.getIfoV1Contract = (address, signer) => {
    return getContract(ifoV1_json_1.default, address, signer);
};
exports.getIfoV2Contract = (address, signer) => {
    return getContract(ifoV2_json_1.default, address, signer);
};
exports.getSouschefContract = (id, signer) => {
    const config = pools_1.default.find((pool) => pool.sousId === id);
    const abi = config.poolCategory === types_1.PoolCategory.BINANCE ? sousChefBnb_json_1.default : sousChef_json_1.default;
    return getContract(abi, addressHelpers_1.getAddress(config.contractAddress), signer);
};
exports.getSouschefV2Contract = (id, signer) => {
    const config = pools_1.default.find((pool) => pool.sousId === id);
    return getContract(sousChefV2_json_1.default, addressHelpers_1.getAddress(config.contractAddress), signer);
};
exports.getPointCenterIfoContract = (signer) => {
    return getContract(pointCenterIfo_json_1.default, addressHelpers_1.getPointCenterIfoAddress(), signer);
};
exports.getCakeContract = (signer) => {
    return getContract(cake_json_1.default, tokens_1.default.cake.address, signer);
};
exports.getProfileContract = (signer) => {
    return getContract(pancakeProfile_json_1.default, addressHelpers_1.getPancakeProfileAddress(), signer);
};
exports.getPancakeRabbitContract = (signer) => {
    return getContract(pancakeRabbits_json_1.default, addressHelpers_1.getPancakeRabbitsAddress(), signer);
};
exports.getBunnyFactoryContract = (signer) => {
    return getContract(bunnyFactory_json_1.default, addressHelpers_1.getBunnyFactoryAddress(), signer);
};
exports.getBunnySpecialContract = (signer) => {
    return getContract(bunnySpecial_json_1.default, addressHelpers_1.getBunnySpecialAddress(), signer);
};
exports.getLotteryV2Contract = (signer) => {
    return getContract(lotteryV2_json_1.default, addressHelpers_1.getLotteryV2Address(), signer);
};
exports.getMasterchefContract = (signer) => {
    return getContract(masterchef_json_1.default, addressHelpers_1.getMasterChefAddress(), signer);
};
exports.getClaimRefundContract = (signer) => {
    return getContract(claimRefund_json_1.default, addressHelpers_1.getClaimRefundAddress(), signer);
};
exports.getTradingCompetitionContract = (signer) => {
    return getContract(tradingCompetition_json_1.default, addressHelpers_1.getTradingCompetitionAddress(), signer);
};
exports.getEasterNftContract = (signer) => {
    return getContract(easterNft_json_1.default, addressHelpers_1.getEasterNftAddress(), signer);
};
exports.getCakeVaultContract = (signer) => {
    return getContract(cakeVault_json_1.default, addressHelpers_1.getCakeVaultAddress(), signer);
};
exports.getPredictionsContract = (signer) => {
    return getContract(predictions_json_1.default, addressHelpers_1.getPredictionsAddress(), signer);
};
exports.getChainlinkOracleContract = (signer) => {
    return getContract(chainlinkOracle_json_1.default, addressHelpers_1.getChainlinkOracleAddress(), signer);
};
exports.getMulticallContract = (signer) => {
    return getContract(Multicall_json_1.default, addressHelpers_1.getMulticallAddress(), signer);
};
exports.getBunnySpecialCakeVaultContract = (signer) => {
    return getContract(bunnySpecialCakeVault_json_1.default, addressHelpers_1.getBunnySpecialCakeVaultAddress(), signer);
};
exports.getBunnySpecialPredictionContract = (signer) => {
    return getContract(bunnySpecialPrediction_json_1.default, addressHelpers_1.getBunnySpecialPredictionAddress(), signer);
};
exports.getBunnySpecialLotteryContract = (signer) => {
    return getContract(bunnySpecialLottery_json_1.default, addressHelpers_1.getBunnySpecialLotteryAddress(), signer);
};
exports.getFarmAuctionContract = (signer) => {
    return getContract(farmAuction_json_1.default, addressHelpers_1.getFarmAuctionAddress(), signer);
};
