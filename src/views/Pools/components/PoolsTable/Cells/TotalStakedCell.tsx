import React, { useMemo } from 'react';
import { Skeleton } from '@kaco/uikit';
// import BigNumber from 'bignumber.js';
import Balance from 'components/Balance';
// import { useCakeVault } from 'state/pools/hooks';
import { getBalanceNumber } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';

interface TotalStakedCellProps {
  decimals: number;
  symbol: string;
  totalStaked?: BigNumber;
}

const TotalStakedCell: React.FC<TotalStakedCellProps> = (props) => {
  // const { sousId, stakingToken, totalStaked, isAutoVault } = pool;
  const { decimals, symbol, totalStaked } = props;
  // const { totalCakeInVault } = useCakeVault();

  // const isManualCakePool = sousId === 0;

  const totalStakedBalance = useMemo(() => {
    // if (isAutoVault) {
    //   return getBalanceNumber(totalCakeInVault, stakingToken.decimals);
    // }
    // if (isManualCakePool) {
    // const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked);
    // return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals);
    // }
    return getBalanceNumber(totalStaked, decimals);
  }, [totalStaked, decimals]);
  // }, [isAutoVault, totalCakeInVault, isManualCakePool, totalStaked, decimals]);
  return totalStaked && totalStaked.gte(0) ? (
    <Balance fontSize="16px" bold value={totalStakedBalance} decimals={0} unit={` ${symbol}`} />
  ) : (
    <Skeleton width="80px" height="16px" />
  );
};

export default TotalStakedCell;
