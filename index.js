const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function transferFunds(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const fromRes = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromId]
    );
    if (fromRes.rows[0].balance < amount) throw new Error('Insufficient funds');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('INSERT INTO transfers(from_id, to_id, amount) VALUES($1,$2,$3)', [fromId, toId, amount]);
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
module.exports = { transferFunds, pool };
