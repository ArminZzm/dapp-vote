'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Blockies from 'react-blockies'
import { dateLocalizedFormat, formatAddress } from '@/utils/format'
import type { PollType } from '@/utils/type'

const PollCard = ({ poll }: { poll: PollType }) => {
  const router = useRouter()
  const {
    id,
    title,
    description,
    timestamp,
    director,
    voters: [voter1, voter2],
    avatars: [avatar1, avatar2]
  } = poll

  return (
    <div className="flex justify-between w-[580px] h-[280px]">
      <div className="flex flex-col gap-[10px] items-center">
        <Image
          src={avatar1 || '/question.jpeg'}
          alt={voter1 || 'avatar'}
          width={217}
          height={135}
          priority
          className="rounded-3xl w-[217px] h-[135px]"
        />
        <Image
          src={avatar2 || '/question.jpeg'}
          alt={voter2 || 'avatar'}
          width={217}
          height={135}
          priority
          className="rounded-3xl w-[217px] h-[135px]"
        />
      </div>

      <div className="w-[352px] flex flex-col gap-5 px-[18px] py-[22px] rounded-3xl bg-slate-950 text-white font-medium">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm">{description}</p>
        <div className="flex justify-between items-center text-xs">
          <p className="px-3 py-1 rounded-full bg-slate-800">
            {dateLocalizedFormat(Number(timestamp))}
          </p>
          <div className="flex gap-2 items-center">
            <Blockies seed={director} size={8} scale={3} className="rounded-full" />
            <p>{formatAddress(director)}</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/poll/${Number(id)}`)}
          className="h-[44px] rounded-full bg-blue-600"
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default PollCard
