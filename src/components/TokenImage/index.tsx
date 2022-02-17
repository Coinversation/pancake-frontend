import React from 'react';
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from '@kaco/uikit';
import { Token } from 'config/constants/types';
import { getAddress } from 'utils/addressHelpers';
import { chainKey } from 'config';

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token;
  secondaryToken: Token;
}

const getImageUrlFromToken = (token: Token) => {
  const address = getAddress(token.address);
  return `/images/tokens/${chainKey}/${address}.svg`;
};

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      {...props}
    />
  );
};

interface TokenImageProps extends ImageProps {
  token: Token;
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />;
};
