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
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var axios_1 = require("axios");
var tokenlist_1 = require("./tokenlist");
var ethers_1 = require("ethers");
var endpoints_1 = require("./config/endpoints");
var tokens_1 = require("./config/tokens");
var https_1 = require("https");
// import { createServer } from "http";
var socket_io_1 = require("socket.io");
var fs_1 = require("fs");
var confirm_1 = require("./confirm");
var orderexecutor_1 = require("./orderexecutor");
var db = require("./db");
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(body_parser_1["default"].json());
app.use(body_parser_1["default"].raw());
app.use((0, cors_1["default"])({
    origin: '*'
}));
app.use('/', express_1["default"].static("../frontend/build"));
app.get('/api/getdata', function (req, res) {
    var symbol = req.query.symbol;
    var op = req.query.op;
    if (op == 'pairs24h') {
        res.json(tokenlist.pairs24h);
        return;
    }
    if (op == 'pairsinfo') {
        var pairsInfo = {};
        if (tokenlist.pairs24h) {
            for (var i = 0; i < tokenlist.pairs24h.length; i++) {
                var pair = tokenlist.pairs24h[i];
                var key = pair.info.base + pair.info.quote;
                pairsInfo[key] = {
                    "base_id": pair.info.base == tokens_1.wbnb.symbol ? tokens_1.wbnb.address : pair.address,
                    "base_name": pair.info.base,
                    "base_symbol": pair.info.base,
                    "quote_id": pair.info.quote == tokens_1.wbnb.symbol ? tokens_1.wbnb.address : pair.address,
                    "quote_name": pair.info.quote,
                    "quote_symbol": pair.info.quote,
                    "last_price": pair.priceBNB,
                    "base_volume": pair.info.base == tokens_1.wbnb.symbol ? pair.liquidityBNB : pair.liquidityToken,
                    "quote_volume": pair.info.quote == tokens_1.wbnb.symbol ? pair.liquidityBNB : pair.liquidityToken
                };
            }
        }
        res.json(pairsInfo);
        return;
    }
    tokenlist.items.forEach(function (token) {
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
app.post('/api/subgraphs', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, response0, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                headers = {
                    'origin': "https://pancakeswap.finance",
                    'referer': 'https://pancakeswap.finance/',
                    'content-type': 'application/json'
                };
                return [4 /*yield*/, axios_1["default"].post("https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2", req.body, {
                        headers: headers
                    })];
            case 1:
                response0 = _a.sent();
                res.json(response0.data);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.json({});
                console.log(e_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/createorder', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ret;
    return __generator(this, function (_a) {
        try {
            data = req.query;
            data.trstatus = "pending";
            ret = db.insert_record("positions", data);
            res.json(ret);
        }
        catch (e) {
            console.log(e.message);
            res.json({});
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/getorder', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chainid, owner, openclose, buysell, timestamp, ordertype, pairs, query, dt, ret;
    return __generator(this, function (_a) {
        try {
            chainid = req.query.chainid;
            owner = req.query.owner;
            openclose = req.query.openclose;
            buysell = req.query.buysell;
            timestamp = req.query.timestamp;
            ordertype = req.query.ordertype;
            pairs = req.query.pairs;
            query = "SELECT * FROM positions WHERE trstatus='confirm' AND chainid=" + (chainid ? chainid : "56");
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
                dt = new Date(Number(timestamp));
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
            ret = db.get_records(query);
            res.json(ret);
        }
        catch (e) {
            console.log(e.message);
            res.json([]);
        }
        return [2 /*return*/];
    });
}); });
var httpServer = (0, https_1.createServer)({
    key: fs_1["default"].readFileSync('./server.pem'),
    cert: fs_1["default"].readFileSync('./server.cert')
}, app);
//const httpServer = createServer(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    socket.on('join', function (room) {
        console.log("connected a room");
        socket.join(room);
    });
});
httpServer.listen(443, function () {
    console.log("Running at localhost:443");
});
var provider = new ethers_1.providers.StaticJsonRpcProvider(endpoints_1.RPCURL);
var tokenlist = new tokenlist_1.Tokens(io, provider);
db.init_mysql();
(0, confirm_1.checkConfirmAlls)();
(0, orderexecutor_1.executeAll)();
var callLink = function () {
    var aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
    var addr = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"; //bnbusd price
    var priceFeed = new ethers_1.ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
    priceFeed.latestRoundData()
        .then(function (roundData) {
        // Do something with roundData
        console.log("Latest Round Data", roundData);
    });
};
setInterval(callLink, 5000);
