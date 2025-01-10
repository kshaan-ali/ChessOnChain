
import { ethers } from 'ethers';
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { signerAtom, signerConnectedAtom } from '../atoms/atoms';

declare global { interface Window { ethereum: any; } }
function useProvider() {
    const [signer,setSigner]=useRecoilState(signerAtom)
    const [signerConnected,setSignerConnected]=useRecoilState(signerConnectedAtom)
    
    useEffect(function(){
        const _signer:any=connectMetamask()
        if(_signer.provider){

            setSigner(_signer)
            setSignerConnected(true)
            console.log(signerConnected)
        }
    },[])

  return signerConnected 
  
}



export async function connectMetamask() {
    let signer = null;

    console.log(" defaults")
    let provider;
    if (window.ethereum == null) {
    
        console.log("MetaMask not installed; using read-only defaults")
        // provider = ethers.getDefaultProvider()
        return false
    
    } else {
    
        provider = new ethers.BrowserProvider(window.ethereum)
    
        signer = await provider.getSigner();
        console.log(signer.address)
       return signer
    }
}
export default useProvider