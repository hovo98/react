"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sample_1 = __importDefault(require("lodash/sample"));
// Array of available nodes to connect to
exports.nodes = [
    process.env.REACT_APP_NODE_1,
    process.env.REACT_APP_NODE_2,
    // process.env.REACT_APP_NODE_3,
    process.env.REACT_APP_NODE_4,
];
const getNodeUrl = () => {
    return sample_1.default(exports.nodes);
};
exports.default = getNodeUrl;
