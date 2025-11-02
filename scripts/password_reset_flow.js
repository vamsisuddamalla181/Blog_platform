const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

(async () => {
  const connectionString = 'postgresql://postgres:Vamsi@123@localhost:5001/mydb';
  const client = new Client({ connectionString });
  const email = 'vamsikrishnan54@gmail.com';
  const username = 'vamsiiii';
  const newPassword = 'NewPass@123';

  try {
    await client.connect();

    // 1) Ensure user exists
    let res = await client.query('SELECT * FROM users WHERE email=$1', [email]);
    let user;
    if (res.rows.length === 0) {
      console.log('User not found, creating test user...');
      const hashed = await bcrypt.hash('OldPass@123', 10);
      const guid = uuidv4();
      await client.query(
        'INSERT INTO users (guid, username, email, password) VALUES ($1, $2, $3, $4)',
        [guid, username, email, hashed]
      );
      res = await client.query('SELECT * FROM users WHERE email=$1', [email]);
    }
    user = res.rows[0];
    console.log('User guid:', user.guid);

    // 2) Simulate forgot-password: generate token and store expiry
    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await client.query(
      'UPDATE users SET password_reset_token=$1, password_reset_expires=$2 WHERE guid=$3',
      [token, expires, user.guid]
    );
    const resetLink = `https://your-frontend.local/reset-password?token=${token}`;
    console.log('\n=== Forgot-password simulated ===');
    console.log('Reset token:', token);
    console.log('Reset link:', resetLink);

    // 3) Simulate user clicking link and submitting new password
    // Verify token and expiry
    const now = new Date();
    const tokenRows = await client.query('SELECT * FROM users WHERE password_reset_token=$1', [token]);
    if (tokenRows.rows.length === 0) {
      throw new Error('Token not found');
    }
    const tokenUser = tokenRows.rows[0];
    if (!tokenUser.password_reset_expires || new Date(tokenUser.password_reset_expires) < now) {
      throw new Error('Token expired');
    }

    // Perform the reset
    const hashedNew = await bcrypt.hash(newPassword, 10);
    await client.query(
      'UPDATE users SET password=$1, password_reset_token=NULL, password_reset_expires=NULL WHERE guid=$2',
      [hashedNew, tokenUser.guid]
    );
    console.log('\n=== Password reset performed successfully ===');

    // 4) Verify login with new password
    const check = await client.query('SELECT * FROM users WHERE email=$1', [email]);
    const updatedUser = check.rows[0];
    const valid = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('Password update verification:', valid ? 'OK' : 'FAILED');

  } catch (err) {
    console.error('ERROR:', err.message || err);
  } finally {
    await client.end();
  }
})();
