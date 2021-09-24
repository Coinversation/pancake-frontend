import { useEffect, useState } from 'react';
import type { BigNumber } from '@ethersproject/bignumber';
import NFT100FactoryAbi from 'config/abi/NFT100Factory.json';
import { NFT_FACTORY, NFT_TYPE } from 'config/constants/nft';
import multicall from 'utils/multicall';
import { useContract } from 'hooks/useContract';
import _ from 'lodash';

export const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

export interface NftPair {
  pairAddress: string;
  nftAddress: string;
  type: NFT_TYPE;
  name: string;
  symbol: string;
  supply: number;
}

const fetchNftPairs = async (count: number): Promise<NftPair[]> => {
  const calls = new Array(count).fill(true).map((_, index) => ({
    address: NFT_FACTORY[chainId],
    name: 'getPairByIndex',
    params: [index],
  }));

  const infos = (await multicall(NFT100FactoryAbi, calls)) as [string, string, BigNumber, string, string, BigNumber][];

  return infos.map((info) => ({
    pairAddress: info[0],
    nftAddress: info[1],
    type: info[2].toNumber(),
    name: info[3],
    symbol: info[4],
    supply: info[5].toNumber(),
  }));
};

const fetchNftPair = async (index: number): Promise<NftPair> => {
  const calls = [
    {
      address: NFT_FACTORY[chainId],
      name: 'getPairByIndex',
      params: [index],
    },
  ];

  const [info] = (await multicall(NFT100FactoryAbi, calls)) as [string, string, BigNumber, string, string, BigNumber][];
  console.log('info', info);

  return {
    pairAddress: info[0],
    nftAddress: info[1],
    type: info[2].toNumber(),
    name: info[3],
    symbol: info[4],
    supply: info[5].toNumber(),
  };
};
export const useNftPairs = () => {
  const [pools, setPools] = useState<NftPair[]>([]);
  const contract = useContract(NFT_FACTORY[chainId], NFT100FactoryAbi);
  console.log('useNftPairs');

  useEffect(() => {
    console.log('useNftPairs effect', contract);
    contract.counter().then(async (counter) => {
      const pairs = await fetchNftPairs(counter.toNumber());
      console.log('useNftPairs contract.counter');

      setPools((oldPairs) => (_.isEqual(oldPairs, pairs) ? oldPairs : pairs));
    }, console.error);
  }, [contract]);

  return pools;
};

export const useNftPair = (index: number) => {
  const [pool, setPool] = useState<NftPair>();

  useEffect(() => {
    fetchNftPair(index).then(setPool);
  }, [index]);

  return pool;
};