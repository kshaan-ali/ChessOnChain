import { Contract } from "ethers";
import { contractAbi, contractAddress } from "./contract";
import { JsonRpcSigner } from "ethers";

export async function contractFetcher(provider:JsonRpcSigner) {
    
    const contract = new Contract(contractAddress, contractAbi, provider)
    return contract
}

