import * as anchor from"@project-serum/anchor";
import { Connection, PublicKey,sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { Program, Provider, web3, utils } from '@project-serum/anchor';
import idl from './idl.json';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
const { SystemProgram } = web3;
const programID = new PublicKey(idl.metadata.address);

async function getProvider(wallet) {
	const network = "https://metaplex.devnet.rpcpool.com";
	const connection = new Connection(network, 'processed');

	const provider = new Provider(
		connection, wallet, 'processed',
	);
	return provider;
}

export const executeAllTransactions = async (
    connection,
    wallet,
    transactions,
  ) => {
    if (transactions.length === 0) return []
  
    const recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
    for (let tx of transactions) {
      tx.feePayer = wallet.publicKey
      tx.recentBlockhash = recentBlockhash
    }
    await wallet.signAllTransactions(transactions)
  
    const txIds = await Promise.all(
      transactions.map(async (tx, index) => {
        try {
          const txid = await sendAndConfirmRawTransaction(
            connection,
            tx.serialize(),
          )
          return txid
        } catch (e) {
          return null
        }
      })
    )
    return txIds
  }
    
export const init = async (wallet) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
	const [bettingPubkey, bettingBump] =
		await web3.PublicKey.findProgramAddress(
		[Buffer.from(utils.bytes.utf8.encode('kings'))],
		program.programId
		);
    await program.rpc.initialize(
        bettingBump,
        {
            accounts: {
                bettingAccount: bettingPubkey,
                initializer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            }
        }
    );        
}

export const solBet = async (wallet, side, amount) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
	const [vault, vaultBump] =
		await web3.PublicKey.findProgramAddress(
		  [Buffer.from(utils.bytes.utf8.encode('betting-public-vault'))],
		  program.programId
		);
    const [userBettingPubkey, userBettingBump] =
		await web3.PublicKey.findProgramAddress(
      [Buffer.from(utils.bytes.utf8.encode('user-info')),
          wallet.publicKey.toBuffer()],
	  	program.programId
		);

    await program.rpc.solBet(
        vaultBump,
        userBettingBump,
        side,
        new anchor.BN(amount).mul(new anchor.BN(1e6)),
        {
            accounts: {
                userAccount: provider.wallet.publicKey,
                escrowAccount: vault,
                userBettingAccount: userBettingPubkey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            }
        }
    );        
}

export const determine = async (wallet) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
	const [vault, vaultBump] =
		await web3.PublicKey.findProgramAddress(
		  [Buffer.from(utils.bytes.utf8.encode('betting-public-vault'))],
		  program.programId
		);
    const [userBettingPubkey, userBettingBump] =
		await web3.PublicKey.findProgramAddress(
      [Buffer.from(utils.bytes.utf8.encode('user-info')),
        wallet.publicKey.toBuffer()],
		  program.programId
		);

    await program.rpc.betResult(
        vaultBump,
        userBettingBump,
        {
            accounts: {
                userAccount: provider.wallet.publicKey,
                escrowAccount: vault,
                userBettingAccount: userBettingPubkey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            }
        }
    );        
}

