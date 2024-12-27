import { IdlAccounts, Program } from "@coral-xyz/anchor";
import idl from "../anchor/idl.json";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
 
export const programId = new PublicKey("L8TVnuJE6oASEa1eokVu6wzcq3486oEVrk2oqNR8Q5z");
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
 
export const ATA_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program(idl as any, {
  connection,
});
 
// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
//export type AnchorData = IdlAccounts<IDL>["anchor"];