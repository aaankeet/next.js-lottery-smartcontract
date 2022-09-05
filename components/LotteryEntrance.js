//
import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const [entryFee, setEntryFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()

  // calling enterLottery function from lottery contract
  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entryFee,
  })
  // getting entryfee from lottery contract
  const { runContractFunction: getEntryFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEntryFee",
    params: {},
  })
  // gettting recent Winner from lottery Contract
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getRecentWinner",
    params: {},
  })
  // getting number of players who joined the lottery
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  useEffect(() => {
    if (isWeb3Enabled) {
      // reading from lottery contract
      async function updateUI() {
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        const entryFeeFromCall = (await getEntryFee()).toString()

        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        setEntryFee(entryFeeFromCall)
      }
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
  }

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Completed",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div>
      Hi from LotteryEntrance
      {lotteryAddress ? (
        <div>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={async function () {
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isFetching || isLoading ? (
              <div className="animate-spin spinner-border h-7 w-7 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lottery</div>
            )}
          </button>
          Entry Fee: {ethers.utils.formatUnits(entryFee, "ether")} ETH
        </div>
      ) : (
        <div>No Lottery Address Detected</div>
      )}
      <div>Number of Players: {numPlayers}</div>
      <div>Recent Winner: {recentWinner}</div>
    </div>
  )
}
