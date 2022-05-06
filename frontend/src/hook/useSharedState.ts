import React, { useState } from "react";
import { useBetween } from "use-between";

// Make a custom hook with your future shared state
const useFormState = () => {
    const [blockchains, setBlockChain]=useState([]);
    const [swapper, setSwapper]=useState([]);
    const [tokens, setTokens]=useState([]);
    const [selectedChain, setSelectedChain]=useState("ETH");
    const [swapInfo, setSwapInfo]=useState({
    	fromToken:undefined,fromChain:"BSC",fromAmount:0,
    	targetToken:undefined,targetChain:"BSC",targetAmount:0
    });


    return {
        blockchains,setBlockChain,
        swapper, setSwapper,
        tokens, setTokens    ,
        swapInfo, setSwapInfo
    };
  };

const useSharedState = () => useBetween(useFormState);

export default useSharedState