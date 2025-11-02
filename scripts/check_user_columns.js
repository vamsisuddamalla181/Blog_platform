const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: 'postgresql://postgres:Vamsi@123@localhost:5001/mydb' });
  try {
    await c.connect();
    const res = await c.query("select column_name from information_schema.columns where table_name='users' and table_schema='public'");
    console.log('users columns:');
    console.log(res.rows.map(r => r.column_name).join('\n'));
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  } finally {
    await c.end();
  }
})();
