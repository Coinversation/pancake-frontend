import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@kaco/uikit';
import { simpleRpcProvider } from 'utils/providers';
import { BLOCK_INTERVAL } from 'config/constants/nft';
import { LockInfo } from '../hooks/useNftWithLocks';

function getLastDate(
  until: number,
  now: number,
): {
  days: number;
  hours: number;
  mins: number;
  secs: number;
} {
  if (now >= until) {
    return {
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
    };
  }

  const all = (until - now) * BLOCK_INTERVAL;
  const m = 60;
  const h = 3600;
  const d = h * 24;
  const daysR = all % d;
  const hoursR = daysR % h;
  const minsR = hoursR % m;

  return {
    days: (all - daysR) / d,
    hours: (daysR - hoursR) / h,
    mins: (hoursR - minsR) / m,
    secs: minsR,
  };
}

const LockTime: FC<{ className?: string; lockInfo: LockInfo | undefined }> = ({ className, lockInfo }) => {
  const [now, setNow] = useState(0);
  const nowDate:
    | {
        days: number;
        hours: number;
        mins: number;
        secs: number;
      }
    | undefined = useMemo(() => lockInfo && getLastDate(lockInfo.lastBlock, now), [lockInfo, now]);

  useEffect(() => {
    simpleRpcProvider.getBlockNumber().then(setNow);
  }, []);

  return (
    <Flex className={className}>
      <div>
        <Text fontSize="20px" bold color="#1BD3D5">
          {nowDate.days}
        </Text>
        <Text fontSize="12px" color="#1BD3D5">
          Days
        </Text>
      </div>
      <div>
        <Text fontSize="20px" bold color="#1BD3D5">
          {nowDate.hours}
        </Text>
        <Text fontSize="12px" color="#1BD3D5">
          Hrs
        </Text>
      </div>
      <div>
        <Text fontSize="20px" bold color="#1BD3D5">
          {nowDate.mins}
        </Text>
        <Text fontSize="12px" color="#1BD3D5">
          Mins
        </Text>
      </div>
      <div>
        <Text fontSize="20px" bold color="#1BD3D5">
          {nowDate.secs}
        </Text>
        <Text fontSize="12px" color="#1BD3D5">
          Secs
        </Text>
      </div>
    </Flex>
  );
};

export default styled(LockTime)`
  width: 100%;
  padding: 0px 31px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0px 11px;
  }
  align-items: center;
  justify-content: space-between;
  > div {
    width: 40px;
    height: 68px;
    background: #1f373b;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px 12px 0px;
  }
`;
