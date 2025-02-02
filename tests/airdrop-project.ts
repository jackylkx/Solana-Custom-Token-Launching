import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import { sendAndConfirmTransaction ,Keypair} from '@solana/web3.js';
import type { Anchor } from '../target/types/anchor';
import { MINT_SIZE } from '@solana/spl-token';

describe('anchor', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Anchor as Program<Anchor>;
  const connection = program.provider.connection;
  const TOKEN_2022_PROGRAM_ID = new anchor.web3.PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
  const wallet = provider.wallet as anchor.Wallet;
  const ATA_PROGRAM_ID = new anchor.web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

  const tokenName = 'Gold Token';
  const tokenSymbol = 'GOLDSOL';
  const tokenUri = 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json';
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('token-2022-token'), wallet.publicKey.toBytes(), Buffer.from(tokenName)],
    program.programId,
  );


  console.log('mint:', mint);
  const [payerATA] = anchor.web3.PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ATA_PROGRAM_ID,
  );
  console.log('payerATA:', payerATA);
  const receiver = anchor.web3.Keypair.generate();

  const [receiverATA] = anchor.web3.PublicKey.findProgramAddressSync(
    [receiver.publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ATA_PROGRAM_ID,
  );
  console.log('receiverATA:', receiverATA);

  it('Create Token-2022 Token', async () => {

    const mintKeypair = new Keypair();
    const tx = new anchor.web3.Transaction();

    const ix = await program.methods
      .createTokenMint(8,tokenName, tokenSymbol, tokenUri)
      .accounts({
        signer: mintKeypair.publicKey,
        mintAccount: mintKeypair,

      })
      .signers([mintKeypair])
      .rpc();

      console.log('Success!');
      console.log(`   Mint Address: ${mintKeypair.publicKey}`);
      console.log(`   Transaction Signature: ${ix}`);

  });

  /* it('Initialize payer ATA', async () => {
    const tx = new anchor.web3.Transaction();

    const ix = await program.methods
      .createAssociatedTokenAccount()
      .accounts({
        tokenAccount: payerATA,
        mint: mint,
        signer: wallet.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const sig = await sendAndConfirmTransaction(program.provider.connection, tx, [wallet.payer]);
    console.log('Your transaction signature', sig);
  }); */

  /*
  // This instruction is included only as a reference, but is not required to run this test, because we are using "init" in the program's transfer instruction. The create_associated_token_account instruction on the program is provided as a reference as well.
  it("Initialize receiver ATA", async () => {
    const tx = new anchor.web3.Transaction();
    const ix = await program.methods
      .createAssociatedTokenAccount()
      .accounts({
        tokenAccount: receiverATA,
        mint: mint,
        signer: receiver.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ATA_PROGRAM_ID,
      })
      .signers([receiver])
      .instruction();
    tx.add(ix);
    const sig = await anchor.web3.sendAndConfirmTransaction(
      program.provider.connection,
      tx,
      [receiver]
    );
    console.log("Your transaction signature", sig);
  });
*/

 /*  it('Mint Token to payer', async () => {
    const tx = new anchor.web3.Transaction();

    const ix = await program.methods
      .mintToken(new anchor.BN(200000000))
      .accounts({
        mint: mint,
        signer: wallet.publicKey,
        receiver: payerATA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const sig = await sendAndConfirmTransaction(program.provider.connection, tx, [wallet.payer]);
    console.log('Your transaction signature', sig);
  });

  // Using init in the transfer instruction, as init if needed is bot working with Token 2022 yet.
  it('Transfer Token', async () => {
    const tx = new anchor.web3.Transaction();

    const ix = await program.methods
      .transferToken(new anchor.BN(100))
      .accounts({
        mint: mint,
        signer: wallet.publicKey,
        from: payerATA,
        to: receiver.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        toAta: receiverATA,
      })
      .instruction();

    tx.add(ix);

    const sig = await sendAndConfirmTransaction(program.provider.connection, tx, [wallet.payer]);
    console.log('Your transaction signature', sig);
  });

  // Using init in the transfer instruction, as init if needed is bot working with Token 2022 yet.
  it('Burn Token', async () => {
    const tx = new anchor.web3.Transaction();

    const balanceOld = await connection.getBalance(payerATA);
    console.log('payerATA Old Balance', balanceOld);
    const tokenbalanceOld = await connection.getTokenAccountBalance(payerATA);
    console.log('payerATA Old Token Balance', tokenbalanceOld);

    const ix = await program.methods
      .burnToken(new anchor.BN(100))
      .accounts({
        mint: mint,
        signer: wallet.publicKey,
        from: payerATA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const sig = await sendAndConfirmTransaction(program.provider.connection, tx, [wallet.payer]);
    console.log('Your transaction signature', sig);


    const balanceNew = await connection.getBalance(payerATA);
    console.log('payerATA New Balance', balanceNew);

    const tokenbalanceNew = await connection.getTokenAccountBalance(payerATA);
    console.log('payerATA New Token Balance', tokenbalanceNew);
  }); */




});