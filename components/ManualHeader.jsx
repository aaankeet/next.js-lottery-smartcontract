// enable Web3

import { useEffect } from "react"
import { useMoralis } from "react-moralis"

//header

export default function ManualHeader() {
  // its a hook, hook lets you "hook into" react state and lifecycle featuress
  // hooks are used to change the state of frontend
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis()

  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account Changed to ${account}`)
      if (account == null) {
        window.localStorage.removeItem("connected")
        deactivateWeb3()
        console.log("Null account Found!")
      }
    })
  }, [])

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3()
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected")
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  )
}
