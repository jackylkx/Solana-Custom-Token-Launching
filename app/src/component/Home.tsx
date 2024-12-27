import '../App.css';
import {Wallet, web3, AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { sendAndConfirmTransaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet, useAnchorWallet  } from "@solana/wallet-adapter-react";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import React, { useState ,useEffect}  from 'react';
import { program, connection, programId, ATA_PROGRAM_ID } from "../anchor/setup";


const Home = () => {

  const { publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [mintAmount, setMintAmount] = useState(0);



  useEffect(() => {
    const setupAnchor = async () => {

    
      if(publicKey){

      console.log("anchorProgram: " + program);
      console.log("provider.wallet: " + publicKey.toString());

      }

    };

    setupAnchor();
  }, [publicKey]);


  // Program ID of the deployed smart contract (replace with your program's ID)
  //const programId = new PublicKey("L8TVnuJE6oASEa1eokVu6wzcq3486oEVrk2oqNR8Q5z");


  const  mintToken = async () => {
    if (!publicKey) {
      alert("Wallet not connected!");
      return;
    }
    if(!tokenName){
      alert("TokenName not set!");
      return;
    }


    try{
      const tx = new web3.Transaction();

      const ix = await (program.methods as any).createToken(tokenName)
        .accounts({
          signer: publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();

        const [mint] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from('token-2022-token'), publicKey.toBytes(), Buffer.from(tokenName)],
          program.programId,
        );  
      
        console.log('mint:', mint);

        const [payerATA] = web3.PublicKey.findProgramAddressSync(
          [publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
          ATA_PROGRAM_ID,
        );


      const ix2 = await (program.methods as any)
        .createAssociatedTokenAccount()
        .accounts({
          tokenAccount: payerATA,
          mint: mint,
          signer: publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();


      const ix3 = await (program.methods as any)
        .mintToken(new BN(mintAmount * 1_000_000_000))
        .accounts({
          mint: mint,
          signer: publicKey,
          receiver: payerATA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();

      tx.add(ix);

      tx.add(ix2);

      tx.add(ix3);

      const signature = await sendTransaction(tx, connection);

      console.log("Transaction sent with signature:", signature);

      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed:", confirmation);

      const ata = await getAssociatedTokenAddress(mint, publicKey);

      // Fetch the account info
      const ataBalance2 = await connection.getTokenAccountBalance(payerATA);

      // Check the balance
      console.log(`Token Balance: ${ataBalance2.toString()}`);
    }catch(exception){
      console.log(exception);
    }
   
  };
    return(
        
        <div className="content">
        <h1>Build Your Token</h1>
        <div className="row mb-3">
          <label htmlFor="tokenName" className="col-sm-3 col-form-label">Token Name:</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id="tokenName"
              placeholder="Token Name"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="tokenName" className="col-sm-3 col-form-label">Amount to Mint (Sol):</label>
          <div className="col-sm-9">
            <input
              type="number"
              className="form-control"
              id="amtToMint"
              placeholder="Amount to Mint (Sol)"
              value={mintAmount}
              onChange={(e) => setMintAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="tokenName" className="col-sm-3 col-form-label">Mint To:</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id="mintTo"
              placeholder="Mint To (Address)"
            />
          </div>
        </div>
        <div className="row mb-3"><input type='button' className='btn btn-primary' value='Mint Token' onClick={mintToken}/></div>
      </div>
        
        
    );      
};
export default Home;
