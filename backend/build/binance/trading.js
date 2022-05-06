"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws = new ws_1.default('wss://stream.binance.com:9443/ws/bnbeth@trade');
ws.on('message', function incoming(data) {
    const trade = JSON.parse(data);
    console.log(trade);
});
