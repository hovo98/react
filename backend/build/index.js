"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const tokenlist_1 = require("./tokenlist");
const ethers_1 = require("ethers");
const endpoints_1 = require("./config/endpoints");
const rango_sdk_1 = require("rango-sdk");
const tokens_1 = require("./config/tokens");
const https_1 = require("https");
// import { createServer } from "http";
const socket_io_1 = require("socket.io");
const fs_1 = __importDefault(require("fs"));
const confirm_1 = require("./confirm");
const orderexecutor_1 = require("./orderexecutor");
const db = __importStar(require("./db"));
const rangoClient = new rango_sdk_1.RangoClient(endpoints_1.rangokey);
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.raw());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use('/', express_1.default.static("../frontend/build"));
app.get('/api/metadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(endpoints_1.rangourl + "/meta?apiKey=" + endpoints_1.rangokey);
    res.json(response.data);
}));
app.post('/api/routing', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const param = req.body;
    const bestRoute = yield rangoClient.getBestRoute(param);
    console.log({ bestRoute });
    res.json(bestRoute);
    return;
    const response = yield axios_1.default.post(endpoints_1.rangourl + "/routing/best?apiKey=" + endpoints_1.rangokey, JSON.stringify(req.body), {
        headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
        }
    });
    res.json(response.data);
}));
app.get('/api/getdata', (req, res) => {
    const symbol = req.query.symbol;
    const op = req.query.op;
    if (op == 'pairs24h') {
        res.json(tokenlist.pairs24h);
        return;
    }
    if (op == 'pairsinfo') {
        let pairsInfo = {};
        if (tokenlist.pairs24h) {
            for (let i = 0; i < tokenlist.pairs24h.length; i++) {
                const pair = tokenlist.pairs24h[i];
                const key = pair.info.base + pair.info.quote;
                pairsInfo[key] = {
                    "base_id": pair.info.base == tokens_1.wbnb.symbol ? tokens_1.wbnb.address : pair.address,
                    "base_name": pair.info.base,
                    "base_symbol": pair.info.base,
                    "quote_id": pair.info.quote == tokens_1.wbnb.symbol ? tokens_1.wbnb.address : pair.address,
                    "quote_name": pair.info.quote,
                    "quote_symbol": pair.info.quote,
                    "last_price": pair.priceBNB,
                    "base_volume": pair.info.base == tokens_1.wbnb.symbol ? pair.liquidityBNB : pair.liquidityToken,
                    "quote_volume": pair.info.quote == tokens_1.wbnb.symbol ? pair.liquidityBNB : pair.liquidityToken,
                };
            }
        }
        res.json(pairsInfo);
        return;
    }
    tokenlist.items.forEach((token) => {
        if (token.symbol == symbol) {
            if (op == "orderbook") {
                res.json(token.orderbook);
                return;
            }
            if (op == "transactions") {
                res.json(token.transantions);
                return;
            }
        }
    });
    res.json({});
});
app.post('/api/subgraphs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = {
            'origin': "https://pancakeswap.finance",
            'referer': 'https://pancakeswap.finance/',
            'content-type': 'application/json'
        };
        const response0 = yield axios_1.default.post("https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2", req.body, {
            headers
        });
        res.json(response0.data);
    }
    catch (e) {
        res.json({});
        console.log(e.message);
    }
}));
app.get('/api/createorder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.query;
        data.trstatus = "pending";
        const ret = db.insert_record("positions", data);
        res.json(ret);
    }
    catch (e) {
        console.log(e.message);
        res.json({});
    }
}));
app.get('/api/getorder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainid = req.query.chainid;
        const owner = req.query.owner;
        const openclose = req.query.openclose;
        const buysell = req.query.buysell;
        const timestamp = req.query.timestamp;
        const ordertype = req.query.ordertype;
        const pairs = req.query.pairs;
        let query = "SELECT * FROM positions WHERE trstatus='confirm' AND chainid=" + (chainid ? chainid : "56");
        if (openclose == "open") { //open order
            query = query + " AND (orderstatus='open' or orderstatus='pending') ";
        }
        else if (openclose == "trade") { //closed order
            query = query + " AND (orderstatus='executed') ";
        }
        if (pairs) {
            query = query + " pairs='" + pairs + "'";
        }
        if (ordertype) { //my order
            query = query + " AND ordertype='" + ordertype + "' ";
        }
        if (timestamp) {
            const dt = new Date(Number(timestamp));
            query = query + " AND timestamp>'" + dt.toISOString().replace('T', " ").substring(0, 19) + "' ";
        }
        if (owner) {
            query = query + " AND owner='" + owner + "' ";
        }
        if (Number(buysell) == 1) {
            query = query + " AND buysell='buy' ";
        }
        if (Number(buysell) == 2) {
            query = query + " AND buysell='sell' ";
        }
        query = query + " ORDER BY id DESC";
        const ret = db.get_records(query);
        res.json(ret);
    }
    catch (e) {
        console.log(e.message);
        res.json([]);
    }
}));
const httpServer = (0, https_1.createServer)({
    key: fs_1.default.readFileSync('./server.pem'),
    cert: fs_1.default.readFileSync('./server.cert')
}, app);
//const httpServer = createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    socket.on('join', function (room) {
        console.log("connected a room");
        socket.join(room);
    });
});
httpServer.listen(443, () => {
    console.log("Running at localhost:443");
});
let provider = new ethers_1.providers.StaticJsonRpcProvider(endpoints_1.RPCURL);
const tokenlist = new tokenlist_1.Tokens(io, provider);
db.init_mysql();
(0, confirm_1.checkConfirmAlls)();
(0, orderexecutor_1.executeAll)();
const callLink = () => {
    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
    const addr = "0xB38722F6A608646a538E882Ee9972D15c86Fc597"; //bnbusd price
    const priceFeed = new ethers_1.ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
    priceFeed.latestRoundData()
        .then((roundData) => {
        // Do something with roundData
        //console.log("Latest Round Data", roundData)
    });
};
setInterval(callLink, 30000);
