import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import { atom, RecoilState } from "recoil";


export const metadataAtom=atom<any[]>({
    key:'metadataAtom',
    default:[]
})
export const metaMetadataAtom=atom<any[]>({
    key:'metaMetadataAtom',
    default:[]
})
export const equippedItemsAtom=atom<number[]>({
    key:'equippedItemsAtom',
    default:[]
})
export const contractAtom=atom<Contract|false>({
    key:'contractAtom',
    default:false
})
export const signerAtom=atom<false|JsonRpcSigner>({
    key:'signerAtom',
    default:false
})
export const userAtom=atom({
    key:'userAtom',
    default:null
})
export const signerConnectedAtom=atom({
    key:'signerConnectedAtom',
    default:false
})