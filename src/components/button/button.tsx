import styles from "./Button.module.css"

interface IButtonProps {
    walletConnected: boolean
    connectWallet: () => void
}

  /*
    renderButton: Returns a button based on the state of the dapp
*/
const RenderButton = ({ walletConnected, connectWallet }: IButtonProps) => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  }

  export default RenderButton