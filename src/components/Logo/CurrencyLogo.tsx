import { CHAINKEY, Currency, ETHER, Token } from '@kaco/sdkv2';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useHttpLocations from '../../hooks/useHttpLocations';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import getTokenLogoURL from '../../utils/getTokenLogoURL';
import SdnSvg from './Sdn.svg';
import Logo from './Logo';
import { chainId } from 'config/constants/tokens';
import { chainKey } from 'config';

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? `${currency.logoURI}` : undefined);

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER[chainId]) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)];
      }
      return [getTokenLogoURL(currency.address)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER[chainId]) {
    if (chainKey === CHAINKEY.ASTR) {
      return (
        <img
          src={`/images/tokens/${chainKey}/0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720.svg`}
          alt=""
          width={size}
          style={style}
        />
      );
    }
    return <img src={SdnSvg} alt="" width={size} style={style} />;
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
