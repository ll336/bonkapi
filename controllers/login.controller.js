require('dotenv').config()
const {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  VersionedTransaction
} = require("@solana/web3.js");
const {
  burnChecked
} = require("@solana/spl-token");
const axios = require('axios');
const connection = new Connection(process.env.RPC_URL);
const fetch = require('cross-fetch');
const{Wallet} = require('@project-serum/anchor');


const processedTransfers = new Set();

async function getList(req, res){
    if (req.body && req.body[0] && Array.isArray(req.body[0].nativeTransfers)) {
        const signature = req.body[0].signature;
        const transfer = req.body[0].nativeTransfers[0];

        // Check if this transfer has already been processed
        if (processedTransfers.has(signature)) {
            console.log('Transfer already processed:', signature);
            return res.status(200).json({Message: 'Transfer already processed'});
        }
        processedTransfers.add(signature);

        if(transfer.toUserAccount == "9UejRas4nfxCdhF7c6h7zSPZo8pK8TuE7V2pN2A2qBsL"){
            const amount = Number(transfer.amount);
            const burnAmount = await getQuote(amount);
            await burnBonk(burnAmount * 0.01);

            if(amount / LAMPORTS_PER_SOL > 0.04){
             
                await swapTokens(100000);
            }

            // Mark this transfer as processed
            
        }

        return res.status(200).json({Message: 'Success!'});
    } else {
        console.error('Token Transfer is not available or not an array');
        return res.status(400).json({Message: 'Invalid request'});
    }
}

async function burnBonk(amount){
const feePayer = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.SECRET_KEY))
);

const alice = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.SECRET_KEY))
);

const mintPubkey = new PublicKey(
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
);

const tokenAccountPubkey = new PublicKey(
  "TyesrqttpGogh4kSCAWDYeLeU7sbmumR2QSvDVWasWc"
);
console.log(`Start Burning Amount: ${amount}`);
const xamount = amount.toFixed(0)
let txhash = await burnChecked(
  connection,
  feePayer, 
  tokenAccountPubkey, 
  mintPubkey, 
  alice, 
  xamount * 100000,
  5
);
console.log(`Amount:${amount} txhash: ${txhash}`);
}


async function getQuote(amount){
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&amount=${amount}`
  const response = await axios.get(url);
  const data = response.data.outAmount / 100000
  return data
}


async function swapTokens(amount){
  const xamount = amount.toFixed(0)
  console.log(`Swapping ${xamount} of Bonk`)
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${xamount}`
  console.log(url)

  const wallet = new Wallet(Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.SECRET_KEY))
  ))
  const quoteResponse = await (
    await fetch(url)
  ).json();

  console.log(quoteResponse)
  const { swapTransaction } = await (
    await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: wallet.publicKey.toString()
       
      })

      
    })
  ).json();

  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
 
  // sign the transaction
  transaction.sign([wallet.payer]);

  const rawTransaction = transaction.serialize()
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
  maxRetries: 2
});

/* const latestBlockHash = await connection.getLatestBlockhash();

await connection.confirmTransaction({
  blockhash: latestBlockHash.blockhash,
  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  signature: txid,
});
 */
console.log(`Swapping Done: https://solscan.io/tx/${txid}`);
}


/* 
module.exports = {
    getList
} */