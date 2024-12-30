export interface PollType {
  id: bigint;
  image: string;
  title: string;
  description: string;
  votes: bigint;
  contestants: bigint;
  deleted: boolean;
  director: `0x${string}`;
  startsAt: bigint;
  endsAt: bigint;
  timestamp: bigint;
  voters: readonly `0x${string}`[];
  avatars: readonly string[];
}

export interface ContestantType {
  id: bigint;
  image: string;
  name: string;
  voter: `0x${string}`;
  votes: bigint;
  voters: readonly `0x${string}`[];
}
