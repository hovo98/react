import {fetchTokenData} from "./tokens/getTokens"

const test = async()=>{
	const data = await fetchTokenData()	
	console.log(data)
}

test();