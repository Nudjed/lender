# Lender

This simple Lender D-App allows an owner of items to:
- Add items to the blockchain.
- Remove items from the blockchain.
- Lend an item to another party and track this transaction on the blockchain.
- Return an item that has been lent out to another party and make it available to lend again.

## 1. Install dependencies

Run `npm install ` to install the projects dependencies (testrpc, web3js, solc)

- **testrpc** - An in memory blockchain (think of it as a blockchain simulator).
- **web3js** - Ethereum JavaScript API used to interact with the blockchain.
- **solc** - Javascript bindings for the solidity compiler.

## 2. Start the test blockchain
Run `node_modules/.bin/testrpc` from the project route directory. This will start the blockchain and also create 10 test accounts with 100 (fake) ethers to play with automatically.

## 3. Compile and deploy the contract

In a second terminal window, run the `node` command in terminal to get in to the node console and initialise the web3 object.
```
node
> Web3 = require('web3')
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```

To make sure web3 object has been initialized and you can communicate with the blockchain, let’s get all the test accounts created in the blockchain.
```
> web3.eth.accounts

[ '0x7b8dbfe1588f3e3625b83a78b583a164cb57c3b2',
  '0xf45cb0af61537075dde13e5703cd95b5e8ff0c91',
  '0x0100517c404465138eea3feb17d6933328353839',
  '0x057bbe6a5b431034d5b1ff2577dfe66c1b864b03',
  '0xbbb942ae94ed639fac5fa9afdbe2cba2a19439e2',
  '0x7463f11c08f60b86b63c1ad2534e9b0f514d2e56',
  '0x7c4ef3851693510f12c35273e1e88ae24e963c11',
  '0x729ea7625fc771e70986fb16533e8e9822210133',
  '0xd15f4d1ee2cf8b4b414a0a8bf26ff2c8f2991a51',
  '0x9c4039b2a79e31cad6f8515207318425a54c6672' ]
```

To compile the contract, load the code from Lender.sol in to a string variable and compile it.
We'll be using the npm module `solc` that we installed with the dependencies.
```
> code = fs.readFileSync('Lender.sol').toString()
> solc = require('solc')
> compiledCode = solc.compile(code)
```

The `compiledCode` variable will contain a contract object, this object has two important fields you need to be aware of:

1. compiledCode.contracts[‘:Lender].bytecode - the bytecode you get when `Lender.sol` is compiled.
2. compiledCode.contracts[‘:Lender].interface -  a template of the contract (called abi) which tells the contract user what methods are available in the contract. You can read more details about ABI [here](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI)

<sup>**_Note: You'll need the `compiledCode.contracts[‘:Lender].interface` code to get the web app working._**</sup>

The next step is to deploy our smart contract to testrpc blockchain:
```
> abiDefinition = JSON.parse(compiledCode.contracts[':Lender'].interface)
> LenderContract = web3.eth.contract(abiDefinition)
> byteCode = compiledCode.contracts[':Lender'].bytecode
> deployedContract = LenderContract.new({data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
```

LenderContract.new above deploys the contract to the blockchain. We pass in the byteCode as the data property, the first testrpc account (they will be the owner of the contract) as the from property and we set a gas limit of 4700000.

If your contract has been deployed successfully to the blockchain you should be able to get the contract address:
```
> deployedContract.address
'0x97e00da837edc396a536f347ab12a5f9ccda5075'
```
<sub>**_Note: You'll need this address to get the web app working_**</sub>

## 4. Run the web app

Open `index.js` and add the interface code to line to 4 and the `deployedContract.address` to line 9.

Now open `index.html` in a web browser and you should see something like this:

![Preview](https://cdn-images-1.medium.com/max/1000/1*atCT361u3RXeXC0AfBPsgg.png)

You'll need to add items to the blockchain before you can lend items out.
