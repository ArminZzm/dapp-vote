import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <header className="flex justify-between items-center px-5 h-20 border border-solid border-gray-400 rounded-full">
      <h1>
        <Link href="/" className="text-2xl text-blue-800">
          Dapp<span className="text-white font-bold">Votes</span>
        </Link>
      </h1>

      <ConnectButton />
    </header>
  )
}

export default Header
