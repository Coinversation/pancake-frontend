import React from 'react';
import styled from 'styled-components';
import { HelpIcon, Skeleton, useTooltip } from '@kaco/uikit';
import { useTranslation } from 'contexts/Localization';

const ReferenceElement = styled.div`
  margin-left: 5px;
  display: inline-block;
`;

export interface MultiplierProps {
  multiplier: string;
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />;
  const { t } = useTranslation();
  const tooltipContent = (
    <div>
      {t('The multiplier represents the amount of KAC rewards each farm gets.')}
      <br />
      <br />
      {t('For example, if a 1x farm was getting 1 KAC per block, a 40x farm would be getting 40 KAC per block.')}
    </div>
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  });

  console.log('multiplier', multiplier);
  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

export default Multiplier;
