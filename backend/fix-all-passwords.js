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

const testAccounts = [
  { email: 'user@test.com', password: 'password123' },
  { email: 'test@test.com', password: 'password123' },
  { email: 'driver@test.com', password: 'password123' },
  { email: 'testdriver@test.com', password: 'password123' },
  { email: 'driver2@test.com', password: 'test123' },
  { email: 'ankurawat8844@gmail.com', password: 'password123' },
  { email: 'newdriver@test.com', password: 'password123' },
  { email: 'testuser@test.com', password: 'password123' },
];

async function fixAllPasswords() {
  console.log('🔧 Fixing passwords for all test accounts...\n');
  
  for (const account of testAccounts) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [account.email]);
      
      if (result.rows.length === 0) {
        console.log(`⏭️  Skipping ${account.email} - not found`);
        continue;
      }

      const user = result.rows[0];
      
      // Test current password
      const isValid = await bcrypt.compare(account.password, user.password_hash);
      
      if (isValid) {
        console.log(`✅ ${account.email} - password already correct`);
      } else {
        // Reset password
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(account.password, salt);
        
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, account.email]);
        console.log(`🔄 ${account.email} - password reset to "${account.password}"`);
      }
    } catch (error) {
      console.error(`❌ Error with ${account.email}:`, error.message);
    }
  }
  
  console.log('\n✅ All passwords fixed!\n');
  console.log('📋 Updated Credentials:');
  console.log('═══════════════════════════════════════');
  testAccounts.forEach(acc => {
    console.log(`Email: ${acc.email}`);
    console.log(`Password: ${acc.password}`);
    console.log('─────────────────────────────────────');
  });
  
  await pool.end();
}

fixAllPasswords();
