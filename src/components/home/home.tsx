'use client'

import { providers } from "ethers";
import { useEffect, useRef, useState } from "react"
import Web3Modal from "web3modal";
import styles from "./Home.module.css"
import Head from "next/head";
import RenderButton from "@/components/button/button";

export default function Home(){
 
   // walletConnected keep track of whether the user's wallet is connected or not
   const [walletConnected, setWalletConnected] = useState(false)
   // Create a reference to the Web3 Modal (used for connecting to Metamask) 
   // which persists as long as the page is open
   const web3ModalRef = useRef<Web3Modal>()
   // ENS
   const [ens, setEns] = useState('')
   // Save the address of the currently connected account
   const [address, setAddress] = useState('')
   /**
   * Sets the ENS, if the current connected address has an associated ENS or else it sets
   * the address of the connected account
   */
    const setEnsOrAddress = async (address: string, web3Provider: providers.Web3Provider) => {
       let _ens = await web3Provider.lookupAddress(address)
       // If the address has an ENS set the ENS or else just set the address
       if(_ens){
        setEns(_ens)
       } else {
        setAddress(address)
       }
    }

     /**
     * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
     *
     * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
     * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
     * request signatures from the user using Signer functions.
     */

     const getProviderOrSigner = async (needSigner: boolean = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` 
        // value to get access to the underlying object
        const provider = await web3ModalRef.current?.connect()
        const web3Provider = new providers.Web3Provider(provider)

        // If user is not connected to the Goerli network, let them know and throw an error
        const { chainId } = await web3Provider.getNetwork()

        if(chainId !== 11155111){
          window.alert('Change the network to sepolia')
          throw new Error("Change network to sepolia")
        }

        const signer = web3Provider.getSigner()
        // Get the address associated to the signer which is connected to  MetaMask
        const address = await signer.getAddress()

        // Calls the function to set the ENS or Address
        await setEnsOrAddress(address, web3Provider)

        return signer
     }

     /*
     connectWallet: Connects the MetaMask wallet
    */
   const connectWallet = async () => {
    try{
       // Get the provider from web3Modal, which in our case is MetaMask
       // When used for the first time, it prompts the user to connect their wallet
       await getProviderOrSigner(true)
       setWalletConnected(true)
    } catch (err) {
      console.error(err)
    }
   }

   // useEffects are used to react to changes in state of the website
   // The array at the end of function call represents what state changes will trigger this effect
   // In this case, whenever the value of `walletConnected` changes - this effect will be called
   useEffect(() => {
     // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
     if(!walletConnected){
         // Assign the Web3Modal class to the reference object by setting it's `current` value
         // The `current` value is persisted throughout as long as this page is open
         web3ModalRef.current = new Web3Modal({
          network: 'sepolia',
          providerOptions: {},
          disableInjectedProvider: false
         })

         connectWallet()
     }
   }, [walletConnected])

  return (
    <div>
    <Head>
      <title>ENS Dapp</title>
      <meta name="description" content="ENS-Dapp" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>
          Welcome to LearnWeb3 Punks {ens ? ens : address}!
        </h1>
        <div className={styles.description}>
          {/* Using HTML Entities for the apostrophe */}
          It&#39;s an NFT collection for LearnWeb3 Punks.
        </div>
        {/* { renderButton() } */}
        <RenderButton walletConnected={ walletConnected } connectWallet={ connectWallet }/>
      </div>
      <div>
        <img className={styles.image} src="/images/learnweb3punks.png" />
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by LearnWeb3 Punks
    </footer>
  </div>
  )
}
