import React, { useState } from 'react';
import { Button, Flex, Text, IconButton, CloseIcon } from '@kaco/uikit';
import { useTranslation } from 'contexts/Localization';
import Modal from 'components/Modal/Modal';
import Claim_KAC_Token_PNG from './Claim_KAC_Token_PNG.png';
import Balance from 'components/Balance';
import styled from 'styled-components';
// import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
// import useToast from 'hooks/useToast';
// import ConnectWalletButton from 'components/ConnectWalletButton';
// todo
// import { getAddressByType } from 'utils/collectibles';
// import { useERC721 } from 'hooks/useContract';

const HeaderStyled = styled(Flex)`
  img {
    width: 60px;
    height: 60px;
    margin-right: 14px;
  }
`;
// const BorderDiv = styled.div`
//   padding: 15px 5%;
//   background: #12171a;
//   border: 1px solid #272e32;
//   border-radius: 12px;
//   margin-bottom: 30px;
// `;
// const BorderInput = styled(Input)`
//   background: #12171a;
//   border: none;
//   padding: 0;
//   font-size: 16px;
// `;
const BgButton = styled(Button)`
  background-color: #1bd3d5;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  height: 48px;
  margin-bottom: 20px;
  &:disabled {
    background-color: #272e32;
  }
`;
interface CollectModalProps {
  onDismiss?: () => void;
}
const CollectModal: React.FC<CollectModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation();
  const [isLoading] = useState(false);
  // const [value, setValue] = useState('');
  // const [error, setError] = useState(null);
  // const contract = useERC721(getAddressByType('pancake'));
  const { account } = useWeb3React();
  // const { toastSuccess } = useToast();

  // const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value: inputValue } = evt.target;
  //   setValue(inputValue);
  // };
  const handleConfirm = async () => {
    // try {
    // const isValidAddress = ethers.utils.isAddress(value);
    // if (!isValidAddress) {
    //   setError(t('Please enter a valid wallet address'));
    // } else {
    // const tx = await contract.transferFrom(account, value, tokenIds[0]);
    // setIsLoading(true);
    // const receipt = await tx.wait();
    // if (receipt.status) {
    //   onDismiss();
    //   onSuccess();
    //   toastSuccess(t('NFT successfully transferred!'));
    // } else {
    //   setError(t('Unable to transfer NFT'));
    //   setIsLoading(false);
    // }
    // }
    // } catch (err) {
    //   console.error('Unable to Claim KAC Token:', err);
    // }
  };

  return (
    <Modal>
      <Flex justifyContent="space-between" mb="10px">
        <HeaderStyled>
          <img src={Claim_KAC_Token_PNG} alt="Claim_KAC_Token_PNG" />
          <div>
            <Balance fontSize="28px" bold value={620.89} decimals={2} unit="KAC" />
            <Text bold fontSize="14px">
              Claim KAC Token
            </Text>
          </div>
        </HeaderStyled>

        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="#484E4E" width="24" />
        </IconButton>
      </Flex>

      <Text padding="0 4%" mt="20px" mb="30px" bold fontSize="14px" lineHeight="24px" color="#9DA6A6">
        Enter an address to trigger a KAC claim. If the address has any claimable KAC it will be sent to them on
        submission.
      </Text>
      {/* <BorderDiv>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <Text color="#9DA6A6;" fontSize="12px" mb="4px">
          Recipient
        </Text>

        <BorderInput
          id="claimAddress"
          name="address"
          type="text"
          placeholder={t('Wallet Address or ENS name')}
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        />
      </BorderDiv> */}
      <BgButton
        minWidth="150px"
        variant="secondary"
        onClick={handleConfirm}
        disabled={!account || isLoading}
        ml="8px"
        mr="8px"
      >
        {t('Claim KAC')}
      </BgButton>
    </Modal>
  );
};

export default CollectModal;