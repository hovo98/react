const ChainId= {
  BSC : 56,
}

const web3url = {
	[ChainId.BSC]:"https://bsc.getblock.io/mainnet/?api_key=2beae857-cbee-479d-852e-9a4d000e65a0",
}

const contract_limit_order = {
	[ChainId.BSC]:"0xf68f73d2d3ca114053fd9859a5c2d367f878e190",
}

const {abi}  = require('./limit_order_bsc');

const LIMIT_ABI = {
	[ChainId.BSC]:abi,
}

const address_executor = "0x96A25dC49300E9c6eb84c40d80E10dCC07E9F043"
const privateKey = "dd6c8c9e5af756712b9e6c375df90e7b9b87b66ced1dc944534c65f3f4aef113";

module.exports = {
  ChainId,
  web3url,
  contract_limit_order,
  LIMIT_ABI,
  address_executor,
  privateKey,  
}