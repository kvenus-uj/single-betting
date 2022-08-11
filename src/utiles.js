import * as anchor from"@project-serum/anchor";
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3, utils } from '@project-serum/anchor';
import idl from './idl.json';
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
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

export const init = async (wallet) => {
    const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
	const [bettingPubkey, bettingBump] =
		await web3.PublicKey.findProgramAddress(
		[Buffer.from(utils.bytes.utf8.encode('single_betting'))],
		program.programId
		);
    await program.rpc.initialize(
        bettingBump,
        {
            accounts: {
                bettingAccount: bettingPubkey,
                initializer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
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
		[Buffer.from(utils.bytes.utf8.encode('betting_vault'))],
		program.programId
		);
    const [userBettingPubkey, userBettingBump] =
		await web3.PublicKey.findProgramAddress(
		[wallet.publicKey.toBuffer()],
		program.programId
		);

    await program.rpc.bet(
        vaultBump,
        userBettingBump,
        side,
        new anchor.BN(amount),
        {
            accounts: {
                payer: provider.wallet.publicKey,
                vault: vault,
                userBettingAccount: userBettingPubkey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
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
		[Buffer.from(utils.bytes.utf8.encode('betting_vault'))],
		program.programId
		);
    const [userBettingPubkey, userBettingBump] =
		await web3.PublicKey.findProgramAddress(
		[wallet.publicKey.toBuffer()],
		program.programId
		);

    await program.rpc.determine(
        vaultBump,
        userBettingBump,
        {
            accounts: {
                payer: provider.wallet.publicKey,
                vault: vault,
                userBettingAccount: userBettingPubkey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            }
        }
    );        
}

