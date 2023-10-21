const crypto = require('crypto');
const { performance } = require('perf_hooks');

class Block {
  constructor(index, previousHash, data) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, '0', 'Genesis Block');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Block hash mismatch');
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Previous hash mismatch');
        return false;
      }
    }
    return true;
  }
}

// Testing the blockchain
const myCoin = new Blockchain();
console.log('Mining block 1...');
const t0 = performance.now();
myCoin.addBlock(new Block(1, myCoin.getLatestBlock().hash, { amount: 4 }));
const t1 = performance.now();
console.log(`Mining took ${t1 - t0} milliseconds`);
console.log('Mining block 2...');
const t2 = performance.now();
myCoin.addBlock(new Block(2, myCoin.getLatestBlock().hash, { amount: 8 }));
const t3 = performance.now();
console.log(`Mining took ${t3 - t2} milliseconds`);

console.log(JSON.stringify(myCoin, null, 2));

console.log('Is blockchain valid? ' + myCoin.isChainValid());

