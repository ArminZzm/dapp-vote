import { useEffect, useState } from 'react'
import { type Address } from 'viem'
import { useReadContract } from 'wagmi'
import type { ContestantType } from '@/utils/type'
import contractAddress from '../../artifacts/contractAddress.json'
import contractABI from '../../artifacts/contracts/DappVotes.sol/DappVotes.json'
import ContestantCard from './ContestantCard'
import { useGlobalStates } from '@/context/GlobalStatesContext'

const ContestantTab = ({ id }: { id: BigInt }) => {
  const { contestantsTrigger, setContestantsTrigger } = useGlobalStates()
  const [contestants, setContestants] = useState<ContestantType[]>([])
  const [allVoters, setAllVoters] = useState<string[]>([])

  const { data, refetch } = useReadContract({
    abi: contractABI.abi,
    address: contractAddress.address as Address,
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
