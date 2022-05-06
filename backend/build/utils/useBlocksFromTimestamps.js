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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocksFromTimestamps = void 0;
const graphql_request_1 = require("graphql-request");
const infoQueryHelpers_1 = require("../utils/infoQueryHelpers");
const endpoints_1 = require("../config/endpoints");
const getBlockSubqueries = (timestamps) => timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }`;
});
const blocksQueryConstructor = (subqueries) => {
    return (0, graphql_request_1.gql) `query blocks {
    ${subqueries}
  }`;
};
/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 */
const getBlocksFromTimestamps = (timestamps, sortDirection = 'desc', skipCount = 500) => __awaiter(void 0, void 0, void 0, function* () {
    if ((timestamps === null || timestamps === void 0 ? void 0 : timestamps.length) === 0) {
        return [];
    }
    const fetchedData = yield (0, infoQueryHelpers_1.multiQuery)(blocksQueryConstructor, getBlockSubqueries(timestamps), endpoints_1.BLOCKS_CLIENT, skipCount);
    const sortingFunction = sortDirection === 'desc' ? (a, b) => b.number - a.number : (a, b) => a.number - b.number;
    const blocks = [];
    if (fetchedData) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(fetchedData)) {
            if (fetchedData[key].length > 0) {
                blocks.push({
                    timestamp: key.split('t')[1],
                    number: parseInt(fetchedData[key][0].number, 10),
                });
            }
        }
        // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
        blocks.sort(sortingFunction);
    }
    return blocks;
});
exports.getBlocksFromTimestamps = getBlocksFromTimestamps;
/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 
export const useBlocksFromTimestamps = (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' = 'desc',
  skipCount = 1000,
): {
  blocks?: Block[]
  error: boolean
} => {
  const [blocks, setBlocks] = useState<Block[]>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getBlocksFromTimestamps(timestamps, sortDirection, skipCount)
      if (result.length === 0) {
        setError(true)
      } else {
        setBlocks(result)
      }
    }
    if (!blocks && !error) {
      fetchData()
    }
  }) // TODO: dep array?

  return {
    blocks,
    error,
  }
}
*/ 
