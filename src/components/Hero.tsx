'use client'

import { useAccount } from 'wagmi'
import { useGlobalStates } from '@/context/GlobalStatesContext'
import { toast } from 'react-toastify'
import PollModal from '@/components/PollModal'

const Hero = () => {
  const { isConnected } = useAccount()
  const { openPollModal } = useGlobalStates()

  const openModal = () => {
    if (!isConnected) {
      return toast.warning('Connect wallet first!')
    }
    openPollModal()
  }

  return (
    <div className="flex flex-col items-center text-white">
      <h2 className="mt-16 text-[45px] font-bold">Vote Without Rigging</h2>
      <p className="mt-8">
        A beauty pageantry is a competition that has traditionally focused on judging and rankingF
        the physical...
      </p>
      <button
        onClick={openModal}
        className="mt-8 w-[148px] h-[45px] border border-solid border-gray-400 rounded-full bg-white hover:bg-opacity-20 text-black font-semibold hover:text-white"
      >
        Create poll
      </button>
      <div className="mt-16">
        <h3 className="text-[34px] text-bol">Start Voting</h3>
      </div>
      <PollModal operation="Add Poll" checkAddressContested={() => false} />
    </div>
  )
}

export default Hero
