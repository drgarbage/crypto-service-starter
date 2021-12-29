import { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import Web3 from 'web3';

export const useWeb3 = () => {
  const web3 = useMemo(() => new Web3(Web3.givenProvider), [Web3.givenProvider]);
  return web3;
}

export const useContract = (artifacts) => {
  const wallet = useWallet();
  const web3 = useWeb3();
  const contract = useMemo(() => {
    if(!web3 || !wallet) return null;
    
    let networkId = 5777; //wallet.chainId;
    
    if(!networkId in artifacts.networks) return null;

    let address = artifacts.networks[networkId].address;
    let abi = artifacts.abi;
    let contract = new web3.eth.Contract(abi, address);
    return contract;
  }, [wallet, artifacts, web3]);
  return contract;
} 