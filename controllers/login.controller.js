require('dotenv').config()
const {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  AccountMeta
} = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} = require("@solana/spl-token");
const connection = new Connection(process.env.RPC_URL);


 
  async function getList(req, res){
    if (req.body && req.body[0] && Array.isArray(req.body[0].tokenTransfers)) {
      

      console.log(req.body)
      console.log(req.body[0].accountData)
      console.log(req.body[0].nativeTransfers)
      console.log(req.body[0].instructions)
          /* if(req.body[0]?.tokenTransfers[0]?.mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){

            const user = await prisma.wallet.findUnique({
              where:{walletAddress: req.body[0].tokenTransfers[0].toUserAccount},
              select:{
                user:{
                  select:{
                    ID:true
                  }
                }
              }
            })

            if(user){
              myEmitter.emit('sendKizz', [{ toWallet: req.body[0].tokenTransfers[0].toUserAccount, amount:req.body[0].tokenTransfers[0].tokenAmount, user: user.user.ID}]);
            }
      
          }  */
       
    } else {
        console.error('Token Transfer is not available or not an array');
    }
    return res.status(200).json({Message: 'Success!'})


  }






module.exports = {
    getList
}