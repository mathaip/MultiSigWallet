# MultiSigWallet
Advanced Smart Contracts Final Project


Steps to setup

1. Git clone this repo

2. npm install 

3. Open Ganache and Connect Ganache to metamask using custom RPC

4. Copy MultiSig.sol to Remix and deploy with arugments. Owners address should be from ganache  eg requiredSignatures = 2 , owners = ['0xdD870fA1b7C4700F2BD7f44238821C26f7392148','0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C']

4. Run Truffle Test, this will provide you will the Signature in the form SigS,SigV, SigR from accounts[0] in Ganache 

5. Copy SigS,SigV, SigR and paste them into remix execute function as well the data, destinationAddress and value of ether you want to send to the destinationAddress. 

DOCUMENTATION

This is a Multi Signature Wallet that allows you set the owners and required signatures neccessary to execute a transaction from this wallet. The neccessary variables needed to structure a multi-signature wallet include a uint256 for a nonce, uint for requiredSignatures a mapping between the Owners and a Boolean to signify that they are owners of the wallet and and array of owners that contains all of the owners of the multiSignature wallet. I attempted to make this multi-signature wallet in as few lines of solidity as possible. With this in mind, the Smart Contract does not have the ability to set new owners or change any of the value in the constructor function. The executeTransaction function uses the owners signature which is a message hashed with the address of the owner. This function takes the Signature as SigV, SigR and SigS as well as a data value, using the erecover library, the function as able to recover the address of the signature and verfiy that they are actually an owner of the wallet. Secondly, the Wallet requires that the set number of required signatures be satisfied before send the value of the ether to the destination address. 



TESTING:

I wrote 4 unit tests, which attempt to test the main functionality of the Smart Contract such as set the owners and required signatures, executeTransaction, make sure the owners are set and checks that the nonce is zero. The ExecuteTransaction test gives a idea of offchain verfying of signatures.

SECURITY:

After researching about the possible security issues with a multi-signature wallet, the biggest concern was replay attacks. Contracts that require signing and veryfying with a signature are vunerable to replay attacks. A replay attack is when a signature is used again to claim authorization for a second action. Because everyone is an owner in a multisignature wallet one owner could replay the transaction so they would be able to send a transaction with the required number of signatures without any of the other owners using their signatures. In this Smart Contract I implemented a nonce iterator, to increment the nonce value on every executed transaction.


EFFICIENCY:

In attempting to optimize the gas cost in this Smart Contract, I decided to try and write a multisig wallet as simply as i could. With that in mind, the contract may lack certain features, such as adding new owners after contract creation or changing the required signature count. I used the Gas profiler on Remix IDE to keep tract of the gas usage and to make sure I wasn't unneccessarily wasting gas. The biggest issue I faced was using a for loop in the contract as I know its not best practise to use for loop as they can use up all the gas and cause the transaction to stall. However, by using a fixed value variable such as ownersArr.length it makes sure the for loop ends once the requirement is satisfied. 


