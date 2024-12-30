import Image from 'next/image'
import { formatAddress } from '@/utils/format'
import Blockies from 'react-blockies'
import { PiArrowFatUpLight } from 'react-icons/pi'
import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'react-toastify'
import { useGlobalStates } from '@/context/GlobalStatesContext'
import type { ContestantType } from '@/utils/type'
import { DAAP_VOTES_ABI } from '@/utils/abis/DappVotes'
import { CONTRACT_ADDRESS } from '@/utils/network'

const ContestantCard = ({
  id,
  contestant,
  allVoters,
  voteable
}: {
  id: bigint
  contestant: ContestantType
  allVoters: string[]
  voteable: boolean
}) => {
  const { address, chainId } = useAccount()
  const { setPollTrigger, setContestantsTrigger } = useGlobalStates()
  const { id: cid, image, name, voter, votes, voters } = contestant
  const { isPending, isError, writeContractAsync } = useWriteContract()

  const checkAddressVoted = () => {
    return allVoters.includes(address as string)
  }

  const vote = async () => {
    if (!voteable) {
      return toast.error('Not enough contestants!')
    }

    if (checkAddressVoted()) {
      return toast.error('Already voted!')
    }

    await writeContractAsync({
      abi: DAAP_VOTES_ABI,
      address: CONTRACT_ADDRESS[chainId || 31337],
      functionName: 'vote',
      args: [id, cid]
    })

    if (isError) {
      toast.error('Unable to vote, please try again!')
    }

    if (!isPending) {
      setPollTrigger(true)
      setContestantsTrigger(true)
      toast.success('Voted successfully!')
    }
  }

  return (
    <div className="flex gap-8">
      <Image
        src={image}
        alt={name}
        width={324}
        height={180}
        priority
        className="rounded-3xl w-[324px] h-[180px] object-cover"
      />
      <div className="w-[250px] h-[180px] flex flex-col items-center gap-2 px-3 py-2 rounded-3xl bg-slate-950 text-white font-semibold">
        <p className="text-xl font-bold">{name}</p>
        <div className="flex items-center gap-2">
          <Blockies seed={voter} size={8} scale={3} className="rounded-full" />
          <p className="text-sm">{formatAddress(voter)}</p>
        </div>
        <button
          onClick={vote}
          disabled={checkAddressVoted()}
          className={`w-[210px] h-12 rounded-full ${checkAddressVoted()
            ? 'bg-gray-600 hover:bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-400'
            }`}
        >
          {voters.includes(address as `0x${string}`) ? 'Voted' : 'Vote'}
        </button>
        <div className="flex items-center gap-2">
          <div className="size-8 flex justify-center items-center rounded-xl bg-blue-950">
            <PiArrowFatUpLight size={20} className="text-blue-600" />
          </div>
          <p className="text-sm">{`${votes} vote`}</p>
        </div>
      </div>
    </div>
  )
}

export default ContestantCard
