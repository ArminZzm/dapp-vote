'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAccount, useReadContract } from 'wagmi'
import { notFound } from 'next/navigation'
import Blockies from 'react-blockies'
import { useCreation } from 'ahooks'
import { useGlobalStates } from '@/context/GlobalStatesContext'
import { MdModeEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import PollModal from '@/components/PollModal'
import ContestantTab from '@/components/ContestantTab'
import { Skeleton } from '@/components/ui/skeleton'
import { type Address } from 'viem'
import type { ContestantType, PollType } from '@/utils/type'
import contractAddress from '../../../../artifacts/contractAddress.json'
import contractABI from '../../../../artifacts/contracts/DappVotes.sol/DappVotes.json'
import { dateLocalizedFormat, formatAddress } from '@/utils/format'

const regex = /^[1-9]\d*$/

const page = () => {
  const params = useParams()
  const id = useCreation(() => params['id'], [params]) as string
  if (!regex.test(id)) {
    notFound()
  }

  const { address, isConnected, isDisconnected } = useAccount()
  const { openPollModal, pollTrigger, setPollTrigger, contestantsTrigger, setContestantsTrigger } =
    useGlobalStates()
  const [operation, setOperation] = useState<string>('')
  const [poll, setPoll] = useState<PollType | null>(null)
  const [contestedAddress, setContestedAddress] = useState<string[]>([])

  const {
    data: pollData,
    isLoading,
    refetch: refetchPoll
  } = useReadContract({
    abi: contractABI.abi,
    address: contractAddress.address as Address,
    functionName: 'getPoll',
    args: [BigInt(id)]
  })

  useEffect(() => {
    if (pollData) {
      const result = pollData as PollType
      setPoll(result)
      if (Number(result.id) === 0) {
        notFound()
      }
    }
  }, [pollData])

  useEffect(() => {
    if (pollTrigger) {
      const fetchData = async () => {
        const { data } = await refetchPoll()
        const result = data as PollType
        setPoll(result)
      }

      fetchData()
      setPollTrigger(false)
    }
  }, [pollTrigger])

  const { data: contestants, refetch: refetchContestants } = useReadContract({
    abi: contractABI.abi,
    address: contractAddress.address as Address,
    functionName: 'getContestants',
    args: [poll?.id]
  })

  useEffect(() => {
    if (contestants) {
      const result = contestants as ContestantType[]
      setContestedAddress(result.reduce((acc, curr) => acc.concat(curr.voter), contestedAddress))
    }
  }, [contestants])

  useEffect(() => {
    if (contestantsTrigger) {
      const fetchData = async () => {
        const { data } = await refetchContestants()
        const result = data as ContestantType[]
        setContestedAddress(result.reduce((acc, curr) => acc.concat(curr.voter), contestedAddress))
      }

      fetchData()
      setContestantsTrigger(false)
    }
  }, [contestantsTrigger])

  const checkAddressContested = () => {
    return contestedAddress.includes(address as string)
  }

  const updatePoll = () => {
    setOperation('Edit Poll')
    openPollModal()
  }

  const deletePoll = () => {
    setOperation('Delete Poll')
    openPollModal()
  }

  const createContestant = () => {
    setOperation('Become a Contestant')
    openPollModal()
  }

  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        const { data } = await refetchPoll()
        const result = data as PollType
        setPoll(result)
      }

      fetchData()
    }
  }, [isConnected])

  useEffect(() => {
    if (isDisconnected) {
      setPoll(null)
    }
  }, [isDisconnected])

  if (isLoading && isConnected) {
    return (
      <>
        <title>loading</title>
        <div className="my-16">
          <Skeleton className="h-[240px] rounded-3xl bg-gray-200" />

          <div className="flex flex-col items-center gap-6 mt-16">
            <Skeleton className="w-[384px] h-[48px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[240px] h-[24px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[313px] h-[38px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[117px] h-[24px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[469px] h-[38px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[148px] h-[42px] rounded-3xl bg-gray-200" />
            <Skeleton className="w-[265px] h-[48px] rounded-3xl bg-gray-200" />
          </div>

          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 justify-center gap-x-12 gap-y-20 mt-6 mb-16">
              <div className="flex gap-8">
                <Skeleton className="w-[324px] h-[180px] rounded-3xl bg-gray-200" />
                <Skeleton className="w-[250px] h-[180px] rounded-3xl bg-gray-200" />
              </div>
              <div className="flex gap-8">
                <Skeleton className="w-[324px] h-[180px] rounded-3xl bg-gray-200" />
                <Skeleton className="w-[250px] h-[180px] rounded-3xl bg-gray-200" />
              </div>
              <div className="flex gap-8">
                <Skeleton className="w-[324px] h-[180px] rounded-3xl bg-gray-200" />
                <Skeleton className="w-[250px] h-[180px] rounded-3xl bg-gray-200" />
              </div>
              <div className="flex gap-8">
                <Skeleton className="w-[324px] h-[180px] rounded-3xl bg-gray-200" />
                <Skeleton className="w-[250px] h-[180px] rounded-3xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (poll && Number(id) !== 0) {
    return (
      <>
        <title>{`Poll | ${poll.title}`}</title>
        <div className="my-16 text-white font-medium">
          <div className="relative h-[240px]">
            <Image
              src={poll.image}
              alt={poll.title}
              fill
              priority
              className="rounded-3xl object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-6 mt-16">
            <h1 className="text-5xl font-semibold">{poll.title}</h1>
            <h2>{poll.description}</h2>
            <p className="px-3 py-[6px] rounded-full border border-solid border-gray-400 bg-gray-500">
              {`${dateLocalizedFormat(Number(poll.startsAt))} - ${dateLocalizedFormat(
                Number(poll.endsAt)
              )}`}
            </p>
            <div className="flex items-center gap-4">
              <Blockies seed={poll.director} size={8} scale={3} className="rounded-full" />
              <p className="text-sm">{formatAddress(poll.director)}</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="px-3 py-[6px] rounded-full border border-solid border-gray-400 bg-gray-500">
                <span>{Number(poll.votes)}</span> votes
              </div>
              <div className="px-3 py-[6px] rounded-full border border-solid border-gray-400 bg-gray-500">
                <span>{Number(poll.contestants)}</span> contestants
              </div>
              {address === poll.director ? (
                <>
                  <button
                    onClick={updatePoll}
                    className="flex items-center gap-[6px] px-3 py-[6px] rounded-full border border-solid border-gray-400 bg-gray-500"
                  >
                    <MdModeEdit size={20} className="text-blue-600" />
                    <div>Edit poll</div>
                  </button>
                  <button
                    onClick={deletePoll}
                    className="flex items-center gap-[6px] px-3 py-[6px] rounded-full border border-solid border-gray-400 bg-gray-500"
                  >
                    <MdDelete size={20} className="text-red-600" />
                    <div>Delete poll</div>
                  </button>
                </>
              ) : null}
            </div>
            <button
              disabled={checkAddressContested()}
              onClick={createContestant}
              className={`w-[148px] h-[42px] rounded-full bg-white text-black ${
                checkAddressContested() ? 'cursor-not-allowed' : ''
              }`}
            >
              Contest
            </button>
            <p className="text-5xl font-semibold">Contestants</p>
            <ContestantTab id={poll.id} />
          </div>
          <PollModal
            operation={operation}
            poll={poll}
            checkAddressContested={checkAddressContested}
          />
        </div>
      </>
    )
  }
}

export default page
