"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("@ethersproject/address");
// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value) {
    try {
        return address_1.getAddress(value);
    }
    catch (_a) {
        return false;
    }
}
exports.isAddress = isAddress;
