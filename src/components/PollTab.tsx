'use client'

import { useEffect, useState } from 'react'
import { useGlobalStates } from '@/context/GlobalStatesContext'
import { useAccount, useReadContract } from 'wagmi'
import PollCard from './PollCard'
import { Skeleton } from '@/components/ui/skeleton'
import { type PollType } from '@/utils/type'
import { DAAP_VOTES_ABI } from '@/utils/abis/DappVotes'
import { CONTRACT_ADDRESS } from '@/utils/network'

const PollTab = () => {
  const { chainId, isConnected, isDisconnected } = useAccount()
  const [polls, setPolls] = useState<PollType[]>([])
  const { pollsTrigger, setPollsTrigger } = useGlobalStates()

  const { data, isLoading, refetch } = useReadContract({
    abi: DAAP_VOTES_ABI,
    address: CONTRACT_ADDRESS[chainId || 31337],
    functionName: 'getPolls'
  })

  useEffect(() => {
    if (data) {
      const result = data as PollType[]
      setPolls(result)
    }
  }, [data])

  useEffect(() => {
    if (pollsTrigger) {
      const fetchData = async () => {
        const { data } = await refetch()
        const result = data as PollType[]
        setPolls(result)
      }

      fetchData()
      setPollsTrigger(false)
    }
  }, [pollsTrigger])

  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        const { data } = await refetch()
        const result = data as PollType[]
        setPolls(result)
      }

      fetchData()
    }
  }, [isConnected])

  useEffect(() => {
    if (isDisconnected) {
      setPolls([])
    }
  }, [isDisconnected])

  if (isLoading && isConnected) {
    return (
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 justify-center gap-x-5 mt-6 mb-16">
          <div className="flex items-center gap-[10px]">
            <div className="flex flex-col items-center gap-[10px]">
              <Skeleton className="w-[217px] h-[135px] rounded-3xl bg-gray-200" />
              <Skeleton className="w-[217px] h-[135px] rounded-3xl bg-gray-200" />
            </div>
            <Skeleton className="w-[352px] h-[280px] rounded-3xl bg-gray-200" />
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="flex flex-col items-center gap-[10px]">
              <Skeleton className="w-[217px] h-[135px] rounded-3xl bg-gray-200" />
              <Skeleton className="w-[217px] h-[135px] rounded-3xl bg-gray-200" />
            </div>
            <Skeleton className="w-[352px] h-[280px] rounded-3xl bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (polls) {
    return (
      <div className="flex justify-center items-center">
        <ul className="grid grid-cols-2 justify-center gap-x-5 gap-y-16 mt-6 mb-16">
          {polls
            .filter(({ deleted }) => !deleted)
            .slice()
            .reverse()
            .map((poll) => (
              <li key={Number(poll.id)}>
                <PollCard poll={poll} />
              </li>
            ))}
        </ul>
      </div>
    )
  }
}

export default PollTab
