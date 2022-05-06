"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const getRpcUrl_1 = __importDefault(require("./getRpcUrl"));
const RPC_URL = getRpcUrl_1.default();
exports.simpleRpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(RPC_URL);
exports.default = null;
