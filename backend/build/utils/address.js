"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddress = void 0;
const address_1 = require("@ethersproject/address");
// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value) {
    try {
        return (0, address_1.getAddress)(value);
    }
    catch (_a) {
        return false;
    }
}
exports.isAddress = isAddress;
