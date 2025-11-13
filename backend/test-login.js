import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'swiftaid_db',
  password: '745406',
  port: 5432,
});

async function testLogin() {
  try {
    // Test password
    const testPassword = 'password123';
    const email = 'driver@test.com';

    // Get user from database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
      return;
    }

    const user = result.rows[0];
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hash_preview: user.password_hash.substring(0, 20) + '...'
    });

    // Test password comparison
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log('\n🔐 Password test for "password123":', isValid ? '✅ VALID' : '❌ INVALID');

    if (!isValid) {
      console.log('\n🔧 Resetting password to "password123"...');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash('password123', salt);
      
      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, email]);
      console.log('✅ Password reset successfully!');
      
      // Verify the new password
      const verifyResult = await pool.query('SELECT password_hash FROM users WHERE email = $1', [email]);
      const isValidNow = await bcrypt.compare('password123', verifyResult.rows[0].password_hash);
      console.log('✅ New password verified:', isValidNow ? 'WORKING' : 'FAILED');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testLogin();
