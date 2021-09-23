import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Button, Modal, InjectedModalProps } from '@kaco/uikit';
import { ModalActions } from 'components/Modal';
import { useTranslation } from 'contexts/Localization';
import MintSvg from '../img/mint.svg';
import { NFT } from 'views/NftPool';
import { NftPair } from 'views/NftPools/hooks/useNftPools';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NFT_TYPE } from 'config/constants/nft';
import { ButtonMenu, ButtonMenuItem } from '@kaco/uikit';
import { useContract } from 'hooks/useContract';
import Erc721 from 'config/abi/erc-721.json';
import Erc1155 from 'config/abi/ERC1155.json';
import * as ethers from 'ethers';
import { simpleRpcProvider } from 'utils/providers';

// const AbiCoder = ethers.utils.AbiCoder;
// const ADDRESS_PREFIX = '41';

//types:参数类型列表，如果函数有多个返回值，列表中类型的顺序应该符合定义的顺序
//output: 解码前的数据
//ignoreMethodHash：对函数返回值解码，ignoreMethodHash填写false，如果是对gettransactionbyid结果中的data字段解码时，ignoreMethodHash填写true

// async function decodeParams(types, output, ignoreMethodHash) {
//   if (!output || typeof output === 'boolean') {
//     ignoreMethodHash = output;
//     output = types;
//   }

//   if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8)
//     output = '0x' + output.replace(/^0x/, '').substring(8);

//   const abiCoder = new AbiCoder();

//   if (output.replace(/^0x/, '').length % 64)
//     throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
//   return abiCoder.decode(types, output).reduce((obj, arg, index) => {
//     if (types[index] == 'address') arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
//     obj.push(arg);
//     return obj;
//   }, []);
// }

const StyledNav = styled.nav`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
`;
interface Props extends InjectedModalProps {
  nft: NFT;
  pair: NftPair;
}

const BLOCKS_ONE_DAY = (3600 * 24) / 3;

const MintModal: React.FC<Props> = ({ onDismiss, nft, pair }) => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const contract = useContract(pair?.nftAddress, pair?.type === NFT_TYPE.NFT721 ? Erc721 : Erc1155);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lockdays, setLockTime] = useState(10);
  // '0xda9760c77805ea7257aed5968769e79d2f4151e2da9760c77805ea7257aed5968769e79d2f4151e2c4ddc3'
  // const data =
  //   '0xb88d4fde000000000000000000000000da9760c77805ea7257aed5968769e79d2f4151e20000000000000000000000003ff2e308012460583ff1519bd504e940a46270c600000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000002bda9760c77805ea7257aed5968769e79d2f4151e2da9760c77805ea7257aed5968769e79d2f4151e2c4ddc3000000000000000000000000000000000000000000';
  // decodeParams(['address', 'address', 'uint256', 'bytes'], data, true).then((result) =>
  //   console.log('xxxxxxxxx', result, result[2].toString()),
  // );

  const onMint = useCallback(async () => {
    if (!account) {
      return;
    }

    let mint: Promise<any>;
    const blockNumber = await simpleRpcProvider.getBlockNumber();
    const data = ethers.utils.solidityPack(
      ['address', 'address', 'uint24'],
      [account, account, lockdays * BLOCKS_ONE_DAY + blockNumber],
    );
    mint = contract.safeTransferFrom(account, pair.pairAddress, nft.id, data);

    console.log('data', data, 'blockNumber', blockNumber);
    if (activeIndex === 0) {
      if (pair.type === NFT_TYPE.NFT721) {
        mint = contract.safeTransferFrom(account, pair.pairAddress, nft.id, '0x');
      } else {
        mint = contract.safeTransferFrom(account, pair.pairAddress, [nft.id], [1], '0x');
      }
    } else {
      if (pair.type === NFT_TYPE.NFT721) {
        mint = contract.safeTransferFrom(account, pair.pairAddress, nft.id, data);
      } else {
        mint = contract.safeTransferFrom(account, pair.pairAddress, [nft.id], [1], data);
      }
    }

    mint.then(
      (s) => {
        alert('success');
        onDismiss();
      },
      (e) => console.log('e', e),
    );
  }, [contract, pair, account, nft, onDismiss, activeIndex, lockdays]);

  return (
    <Modal style={{ position: 'relative' }} maxWidth="400px" width="100%" title={null} onDismiss={onDismiss}>
      <StyledNav style={{ position: 'absolute', top: '20px' }}>
        <ButtonMenu activeIndex={activeIndex} variant="subtle">
          <ButtonMenuItem>
            <Text width="100%" onClick={() => setActiveIndex(0)}>
              {t('Mint')}
            </Text>
          </ButtonMenuItem>
          <ButtonMenuItem>
            <Text width="100%" onClick={() => setActiveIndex(1)}>
              {t('Lock Mint')}
            </Text>
          </ButtonMenuItem>
        </ButtonMenu>
      </StyledNav>
      {activeIndex === 0 ? (
        <div style={{ maxWidth: '400px' }}>
          <Flex
            style={{
              padding: '13px 14px',
              background: '#272E32',
              borderRadius: '20px',
              alignItems: 'center',
            }}
          >
            <img src={nft.image} alt="" style={{ width: '69px', height: '69px' }} />
            <Text bold fontSize="20px" color="white" ml="30px">
              {nft.name}#{nft.id}
            </Text>
          </Flex>
          <Flex justifyContent="center">
            <img src={MintSvg} alt="" style={{ position: 'relative', top: '-10px', zIndex: 2 }} />
          </Flex>
          <Flex
            style={{
              padding: '13px 14px',
              background: '#272E32',
              borderRadius: '20px',
              position: 'relative',
              top: '-20px',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                background: '#6EB395',
                borderRadius: '34px',
              }}
            />
            <Flex ml="30px" flexDirection="column" justifyContent="center">
              <Text bold fontSize="20px" color="white">
                {pair.symbol}
              </Text>
              <Text fontSize="12px" color="#1BD3D5">
                Quantity 100
              </Text>
            </Flex>
          </Flex>
        </div>
      ) : (
        <div style={{ maxWidth: '400px' }}>
          <div
            style={{
              padding: '13px 14px',
              background: '#272E32',
              borderRadius: '20px',
              alignItems: 'center',
            }}
          >
            <Flex
              style={{
                padding: '13px 14px',
                background: '#272E32',
                borderRadius: '20px',
                alignItems: 'center',
              }}
            >
              <img src={nft.image} alt="" style={{ width: '69px', height: '69px' }} />
              <div>
                <Text bold fontSize="20px" color="white" ml="30px">
                  Your sale method for
                </Text>
                <Text bold fontSize="20px" color="white" ml="30px">
                  {nft.name}#{nft.id}
                </Text>
              </div>
            </Flex>
            <Text color="#9DA6A6" fontSize="12px" mb="12px" mt="26px" pl="10px">
              Choose lock time
            </Text>
            <Flex padding="10px 20px" alignItems="center" background="#1F252A" borderRadius="12px">
              <Text fontSize="16px" bold style={{ flex: '1' }}>
                {lockdays} Day
              </Text>
              <Button
                mx="10px"
                variant="secondary"
                onClick={() => {
                  if (lockdays > 1) {
                    setLockTime((old) => old - 1);
                  }
                }}
              >
                -
              </Button>
              <Button
                onClick={() => {
                  if (lockdays < 30) {
                    setLockTime((old) => old + 1);
                  }
                }}
              >
                +
              </Button>
            </Flex>
          </div>
          <Flex justifyContent="center">
            <img src={MintSvg} alt="" style={{ position: 'relative', top: '-10px', zIndex: 2 }} />
          </Flex>
          <Flex
            style={{
              padding: '13px 14px',
              background: '#272E32',
              borderRadius: '20px',
              position: 'relative',
              top: '-20px',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                background: '#6EB395',
                borderRadius: '34px',
              }}
            />
            <Flex ml="30px" flexDirection="column" justifyContent="center">
              <Text bold fontSize="20px" color="white">
                {pair.symbol}
              </Text>
              <Text fontSize="12px" color="#1BD3D5">
                Quantity 100
              </Text>
            </Flex>
          </Flex>
          <Text textAlign="center" color="#F1842C" fontSize="12px" bold px="36px">
            The default is 3% handling fee, add 1 day to increase 0.01% handling fee
          </Text>
        </div>
      )}
      <ModalActions>
        <Button onClick={onMint} width="100%">
          {t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default MintModal;
