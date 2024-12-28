'use client'

import { useRouter } from 'next/navigation'
import { useGlobalStates } from '@/context/GlobalStatesContext'
import { IoClose } from 'react-icons/io5'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useWriteContract } from 'wagmi'
import { toast } from 'react-toastify'
import { MdDelete } from 'react-icons/md'
import { PATTERN, date2BigInt, dateFormat } from '@/utils/format'
import { type Address } from 'viem'
import type { PollType } from '@/utils/type'
import contractAddress from '../../artifacts/contractAddress.json'
import contractABI from '../../artifacts/contracts/DappVotes.sol/DappVotes.json'

const operationConfig = {
  'Add Poll': [
    'createPoll',
    'Creating',
    'Create Poll',
    'Unable to create poll, please try again!',
    'Poll created successfully!'
  ],
  'Edit Poll': [
    'updatePoll',
    'Updating',
    'Update Poll',
    'Unable to update poll, please try again!',
    'Poll updated successfully!'
  ],
  'Delete Poll': [
    'deletePoll',
    'Deleting',
    'Delete Poll',
    'Unable to delete poll, please try again!',
    'Poll deleted successfully!'
  ],
  'Become a Contestant': [
    'contest',
    'Contesting',
    'Contest Now',
    'Unable to contest, please try again!',
    'Contest successfully!'
  ]
}

const PollForm = ({ operation, poll }: { operation: string; poll?: PollType }) => {
  const [functionName, pendingbutton, completedButton, errorMessage, successMessage] =
    operationConfig[operation as 'Add Poll' | 'Edit Poll']
  const { pollModal, closePollModal, setPollTrigger, setPollsTrigger } = useGlobalStates()
  const { isPending, isError, writeContractAsync } = useWriteContract()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const quitForm = () => {
    reset()
    closePollModal()
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { title, image, description, startsAt, endsAt } = data

    if (date2BigInt(startsAt) > date2BigInt(endsAt)) {
      return toast.error('End date must be greater than start date!')
    }

    if (poll && Number(poll.votes) > 0) {
      return toast.error('Poll has votes already!')
    }

    await writeContractAsync({
      address: contractAddress.address as Address,
      abi: contractABI.abi,
      functionName,
      args: poll
        ? [poll?.id, image, title, description, date2BigInt(startsAt), date2BigInt(endsAt)]
        : [image, title, description, date2BigInt(startsAt), date2BigInt(endsAt)]
    })

    if (isError) {
      toast.error(errorMessage)
    }

    if (!isPending) {
      quitForm()
      setPollTrigger(true)
      setPollsTrigger(true)
      toast.success(successMessage)
    }
  }

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${pollModal}`}
    >
      <div className="w-[580px] h-[550px] p-6 rounded-xl bg-slate-900">
        <div className="flex justify-between items-center">
          <h1 className="text-gray-400 font-bold">{operation}</h1>
          <button onClick={quitForm}>
            <IoClose size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center mt-7 mb-5 text-sm text-gray-400 font-medium"
        >
          <div className="relative w-full p-4 border border-solid border-blue-950 rounded-full">
            <input
              {...register('title', {
                required: 'Poll Title is required!'
              })}
              defaultValue={poll?.title}
              type="text"
              placeholder="Poll Title"
              autoComplete="off"
              className="w-full bg-transparent outline-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
            />
            {errors.title && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.title.message}`}</p>
            )}
          </div>
          <div className="relative w-full p-4 border border-solid border-blue-950 rounded-full">
            <div className="absolute top-[3px] left-[3px] w-[192px] h-[48px] rounded-full bg-blue-600 bg-opacity-20"></div>
            <input
              {...register('startsAt', {
                required: 'StartsAt is required!'
              })}
              defaultValue={
                poll ? dateFormat(Number(poll.startsAt), PATTERN['YYYY-MM-DDTHH:mm']) : ''
              }
              type="datetime-local"
              autoComplete="off"
              className="w-full bg-transparent outline-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
            />
            {errors.startsAt && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.startsAt.message}`}</p>
            )}
          </div>
          <div className="relative w-full p-4 border border-solid border-blue-950 rounded-full">
            <div className="absolute top-[3px] left-[3px] w-[192px] h-[48px] rounded-full bg-blue-600 bg-opacity-20"></div>
            <input
              {...register('endsAt', {
                required: 'EndsAt is required!'
              })}
              defaultValue={
                poll ? dateFormat(Number(poll.endsAt), PATTERN['YYYY-MM-DDTHH:mm']) : ''
              }
              type="datetime-local"
              autoComplete="off"
              className="w-full bg-transparent outline-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
            />
            {errors.endsAt && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.endsAt.message}`}</p>
            )}
          </div>
          <div className="relative w-full p-4 border border-solid border-blue-950 rounded-full">
            <input
              {...register('image', {
                required: 'Banner URL is required!',
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[\w-.~!$&'()*+,;=:@%]*)*(\?[\w-.~!$&'()*+,;=:@/?%]*)?(#[\w-.~!$&'()*+,;=:@/?%]*)?$/,
                  message: 'Invalid URL'
                }
              })}
              defaultValue={poll?.image}
              type="text"
              placeholder="Banner URL"
              autoComplete="off"
              className="w-full bg-transparent outline-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
            />
            {errors.image && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.image.message}`}</p>
            )}
          </div>
          <div className="relative w-full p-4 border border-solid border-blue-950 rounded-xl ">
            <textarea
              {...register('description', {
                required: 'Poll Description is required!'
              })}
              defaultValue={poll?.description}
              placeholder="Poll Description"
              autoComplete="off"
              className="w-full bg-transparent outline-none resize-none text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
            />
            {errors.description && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.description.message}`}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full h-12 rounded-full font-bold ${
              isPending
                ? 'bg-gray-600 hover:bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-400 text-gray-400'
            }`}
          >
            {isPending ? `${pendingbutton}` : `${completedButton}`}
          </button>
        </form>
      </div>
    </div>
  )
}

const DeletePoll = ({ operation, poll }: { operation: string; poll?: PollType }) => {
  const router = useRouter()
  const [functionName, pendingbutton, completedButton, errorMessage, successMessage] =
    operationConfig[operation as 'Delete Poll']
  const { pollModal, closePollModal } = useGlobalStates()
  const { isPending, writeContractAsync } = useWriteContract()

  const deletePoll = async () => {
    if (poll && Number(poll.votes) > 0) {
      return toast.error('Poll has votes already!')
    }

    const hash = await writeContractAsync({
      address: contractAddress.address as Address,
      abi: contractABI.abi,
      functionName,
      args: [poll?.id]
    })

    if (!hash) {
      toast.error(errorMessage)
    }

    if (!isPending) {
      closePollModal()
      router.push('/')
      toast.success(successMessage)
    }
  }

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${pollModal}`}
    >
      <div className="w-[550px] h-[350px] flex flex-col items-center gap-5 p-6 rounded-xl bg-slate-900 text-gray-400  font-semibold">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-bold">{operation}</h1>
          <button onClick={closePollModal}>
            <IoClose size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mt-2">
          <MdDelete size={50} className="text-red-600" />
          <p className="text-2xl">{operation}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm">Are you sure you want to delete this question?</p>
          <p className="text-xs">{poll?.title}</p>
        </div>

        <button
          onClick={deletePoll}
          disabled={isPending}
          className={`w-full h-12 mt-2 rounded-full text-sm ${
            isPending
              ? 'bg-gray-600 hover:bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-400'
          }`}
        >
          {isPending ? `${pendingbutton}` : `${completedButton}`}
        </button>
      </div>
    </div>
  )
}

const CreateContestant = ({
  id,
  operation,
  checkAddressContested
}: {
  id: BigInt
  operation: string
  checkAddressContested: () => boolean
}) => {
  const { setPollTrigger, setContestantsTrigger } = useGlobalStates()
  const [functionName, pendingbutton, completedButton, errorMessage, successMessage] =
    operationConfig[operation as 'Become a Contestant']
  const { pollModal, closePollModal } = useGlobalStates()
  const { isPending, writeContractAsync } = useWriteContract()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const quitForm = () => {
    reset()
    closePollModal()
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (checkAddressContested()) {
      toast.error('Already contested!')
      return
    }

    const { name, url } = data
    const hash = await writeContractAsync({
      address: contractAddress.address as Address,
      abi: contractABI.abi,
      functionName,
      args: [id, name, url]
    })

    if (!hash) {
      toast.error(errorMessage)
    }

    if (!isPending) {
      quitForm()
      setPollTrigger(true)
      setContestantsTrigger(true)
      toast.success(successMessage)
    }
  }

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${pollModal}`}
    >
      <div className="w-[580px] h-[320px] rounded-3xl p-6 bg-slate-950 text-gray-400 font-semibold">
        <div className="flex justify-between items-center mb-5">
          <h1 className="font-bold">{operation}</h1>
          <button onClick={quitForm}>
            <IoClose size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
          <div className="relative w-full p-4 rounded-full border border-soild border-gray-600">
            <input
              {...register('name', {
                required: 'Contestant Name is required!'
              })}
              type="text"
              placeholder="Contestant Name"
              autoComplete="off"
              className="w-full bg-transparent text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:font-semibold outline-none"
            />
            {errors.name && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.name.message}`}</p>
            )}
          </div>
          <div className="relative w-full p-4 rounded-full border border-solid border-gray-600 ">
            <input
              {...register('url', {
                required: 'Avatar URL is required!',
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[\w-.~!$&'()*+,;=:@%]*)*(\?[\w-.~!$&'()*+,;=:@/?%]*)?(#[\w-.~!$&'()*+,;=:@/?%]*)?$/,
                  message: 'Invalid URL'
                }
              })}
              type="text"
              placeholder="Avatar URL"
              autoComplete="off"
              className="w-full bg-transparent text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:font-semibold outline-none"
            />
            {errors.url && (
              <p className="absolute bottom-0 text-sm text-red-600 font-semibold">{`${errors.url.message}`}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full h-12 rounded-full ${
              isPending
                ? 'bg-gray-600 hover:bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-400 text-gray-400'
            }`}
          >
            {isPending ? pendingbutton : completedButton}
          </button>
        </form>
      </div>
    </div>
  )
}

const PollModal = ({
  operation,
  poll,
  checkAddressContested
}: {
  operation: string
  poll?: PollType
  checkAddressContested: () => boolean
}) => {
  if (operation === 'Add Poll' || operation === 'Edit Poll') {
    return <PollForm operation={operation} poll={poll} />
  }

  if (operation === 'Delete Poll') {
    return <DeletePoll operation={operation} poll={poll} />
  }

  if (operation === 'Become a Contestant') {
    return (
      <CreateContestant
        id={poll!.id}
        operation={operation}
        checkAddressContested={checkAddressContested}
      />
    )
  }
}

export default PollModal
