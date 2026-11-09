const { transferFunds } = require('./index.js');

async function runTest() {
  console.log('Testing 50 parallel transfers for concurrency control...');
  const promises = [];
  for(let i=0; i<50; i++) {
    promises.push(transferFunds(1, 2, 100).catch(e => e.message));
  }
  const results = await Promise.all(promises);
  console.log(`Completed ${results.length} transactions`);
  console.log(results);
}
runTest();
