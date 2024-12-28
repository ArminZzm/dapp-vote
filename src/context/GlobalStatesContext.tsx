'use client'

import { type Dispatch, type SetStateAction, createContext, useContext, useState } from 'react'

export const GlobalStatesContext = createContext<{
  pollModal: string
  openPollModal: () => void
  closePollModal: () => void
  pollTrigger: boolean
  setPollTrigger: Dispatch<SetStateAction<boolean>>
  pollsTrigger: boolean
  setPollsTrigger: Dispatch<SetStateAction<boolean>>
  contestantsTrigger: boolean
  setContestantsTrigger: Dispatch<SetStateAction<boolean>>
}>({
  pollModal: 'scale-0',
  openPollModal: () => {},
  closePollModal: () => {},
  pollTrigger: false,
  setPollTrigger: () => {},
  pollsTrigger: false,
  setPollsTrigger: () => {},
  contestantsTrigger: false,
  setContestantsTrigger: () => {}
})

const GlobalStatesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pollModal, setPollModal] = useState<string>('scale-0')
  const [pollTrigger, setPollTrigger] = useState<boolean>(false)
  const [pollsTrigger, setPollsTrigger] = useState<boolean>(false)
  const [contestantsTrigger, setContestantsTrigger] = useState<boolean>(false)

  const openPollModal = () => {
    setPollModal('scale-100')
  }

  const closePollModal = () => {
    setPollModal('scale-0')
  }

  return (
    <GlobalStatesContext.Provider
      value={{
        pollModal,
        openPollModal,
        closePollModal,
        pollTrigger,
        setPollTrigger,
        pollsTrigger,
        setPollsTrigger,
        contestantsTrigger,
        setContestantsTrigger
      }}
    >
      {children}
    </GlobalStatesContext.Provider>
  )
}

export default GlobalStatesContextProvider

export const useGlobalStates = () => {
  return useContext(GlobalStatesContext)
}
