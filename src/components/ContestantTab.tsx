import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import type { ContestantType } from '@/utils/type'
import { DAAP_VOTES_ABI } from '@/utils/abis/DappVotes'
import { CONTRACT_ADDRESS } from '@/utils/network'
import ContestantCard from './ContestantCard'
import { useGlobalStates } from '@/context/GlobalStatesContext'

const ContestantTab = ({ id }: { id: bigint }) => {
  const { chainId } = useAccount()
  const { contestantsTrigger, setContestantsTrigger } = useGlobalStates()
  const [contestants, setContestants] = useState<ContestantType[]>([])
  const [allVoters, setAllVoters] = useState<string[]>([])

  const { data, refetch } = useReadContract({
    abi: DAAP_VOTES_ABI,
    address: CONTRACT_ADDRESS[chainId || 31337],
    functionName: 'getContestants',
    args: [id]
  })

  useEffect(() => {
    if (data) {
      const result = data as ContestantType[]
      setContestants(result)
      setAllVoters(result.reduce((acc, curr) => acc.concat(curr.voters), allVoters))
    }
  }, [data])

  useEffect(() => {
    if (contestantsTrigger) {
      const fetchData = async () => {
        const { data } = await refetch()
        const result = data as ContestantType[]
        setContestants(result)
      }

      fetchData()
      setContestantsTrigger(false)
    }
  }, [contestantsTrigger])

  return (
    <ul className="grid grid-cols-2 gap-x-12 gap-y-20 mt-6 mb-16">
      {contestants
        .sort((a, b) => Number(b.votes) - Number(a.votes))
        .map((contestant) => (
          <li key={Number(contestant.id)}>
            <ContestantCard
              id={id}
              contestant={contestant}
              allVoters={allVoters}
              voteable={contestants.length > 1}
            />
          </li>
        ))}
    </ul>
  )
}

export default ContestantTab
