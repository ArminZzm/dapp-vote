export interface PollType {
  id: BigInt
  image: string
  title: string
  description: string
  votes: BigInt
  contestants: BigInt
  deleted: boolean
  director: string
  startsAt: BigInt
  endsAt: BigInt
  timestamp: BigInt
  voters: string[]
  avatars: string[]
}

export interface ContestantType {
  id: BigInt
  image: string
  name: string
  voter: string
  votes: BigInt
  voters: string[]
}
