import '../App.css';
import {Wallet, web3, AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { sendAndConfirmTransaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet, useAnchorWallet  } from "@solana/wallet-adapter-react";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import React, { useState ,useEffect}  from 'react';
import { program, connection, programId, ATA_PROGRAM_ID } from "../anchor/setup";

const AirdropToken = () => {
    const [tokenName, setTokenName] = useState("Test3");
    const [transferTo, setTransferTo]= useState("");
    const [airdropAmount, setAirdropAmount]= useState("");
    const [tokenBalance, setTokenBalance] = useState(0);
    const { publicKey, sendTransaction } = useWallet();



    useEffect(()=>{
        const getTokenBalance = async () => {

            if (publicKey && tokenName) {
                const [mint] = web3.PublicKey.findProgramAddressSync(
                    [Buffer.from('token-2022-token'), publicKey.toBytes(), Buffer.from(tokenName)],
                    program.programId,
                );  
                const [payerATA] = web3.PublicKey.findProgramAddressSync(
                    [publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
                    ATA_PROGRAM_ID,
                );
        
                const ata = await getAssociatedTokenAddress(mint, publicKey);
        
                // Fetch the account info
                const ataBalance2 = await connection.getTokenAccountBalance(payerATA);
                setTokenBalance(Number(ataBalance2.value.amount)/ 1_000_000_000);
                // Check the balance
                console.log(`Token Balance: ${tokenBalance}`);
              }
    
           
        };

        getTokenBalance();
    },[publicKey,tokenName]);

    const  transferToken = async () => {
        const tx = new web3.Transaction();
        
        var receiver;
        var isSolana;
        let is
        try{
            receiver = new PublicKey(transferTo);
            isSolana =  PublicKey.isOnCurve(receiver.toBuffer())
        }catch(Exception){
            alert("Airdrop address is invalid");
            return;
        }
        

        try{
            if(!isSolana){
                alert("Airdrop address is invalid");
            }
            else if(isSolana && publicKey && receiver){


                const [mint] = web3.PublicKey.findProgramAddressSync(
                  [Buffer.from('token-2022-token'), publicKey.toBytes(), Buffer.from(tokenName)],
                  program.programId,
              );  
                const [payerATA] = web3.PublicKey.findProgramAddressSync(
                  [publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
                  ATA_PROGRAM_ID,
              );
  
              const [receiverATA] = web3.PublicKey.findProgramAddressSync(
                  [receiver.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
                  ATA_PROGRAM_ID,
                );
  
              const ix = await (program.methods as any)
              .transferToken(new BN(Number(airdropAmount)* 1_000_000_000))
              .accounts({
                mint: mint,
                signer: publicKey,
                from: payerATA,
                to: receiver,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
                toAta: receiverATA,
              })
              .instruction();
  
              tx.add(ix);
  
              const signature = await sendTransaction(tx, connection);
        
              console.log("Transaction sent with signature:", signature);
        
              const confirmation = await connection.confirmTransaction(signature, "confirmed");
              console.log("Transaction confirmed:", confirmation);
        
              const ata = await getAssociatedTokenAddress(mint, publicKey);
        
              // Fetch the account info
              const ataBalance2 = await connection.getTokenAccountBalance(receiverATA);
        
              // Check the balance
              console.log(`Receiver Token Balance: ${ataBalance2.toString()}`);
          }
          
  
        }catch(error){
            console.error("Transaction failed:", error);
        }

      

    }
    return (
        <div className="content">
            {tokenName!= "" && tokenBalance != 0 ?(
                <div>
                    <h1>{tokenName}</h1>
                    <div className="row mb-3">
                        <label htmlFor="tokenName" className="col-sm-3 col-form-label">Token Balance:</label>
                        <div className="col-sm-9">
                            <span>{tokenBalance}</span>
                        </div>
                    </div>

                    <div className="row mb-3">
                    <label htmlFor="transferTo" className="col-sm-3 col-form-label">Airdrop to (Address):</label>
                        <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="transferTo"
                            placeholder="Address"
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                    <label htmlFor="airdropAmount" className="col-sm-3 col-form-label">Airdrop Amount:</label>
                        <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="airdropAmount"
                            placeholder="Airdrop Amount"
                            value={airdropAmount}
                            onChange={(e) => setAirdropAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3"><input type='button' className='btn btn-primary' value='Airdrop Token' onClick={transferToken}/></div>
                </div>
                
            ) : null}
        </div>

        
    );
};
export default AirdropToken;

