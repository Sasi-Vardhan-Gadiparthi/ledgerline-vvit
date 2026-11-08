const { transferFunds } = require('./index.js');
async function runTest() {
  console.log('Testing 10 parallel transfers...');
  const promises = [];
  for(let i=0; i<10; i++) {
    promises.push(transferFunds(1, 2, 100).catch(e => e.message));
  }
  const results = await Promise.all(promises);
  console.log(results);
}
runTest();
