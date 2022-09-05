import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <div className="border-b-2 flex flex-row">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Decentralized Lottery
        </span>{" "}
      </h1>
      <h1 className="ml-auto py-4 px-3">
        <ConnectButton moralisAuth={false} />
      </h1>
    </div>
  )
}
