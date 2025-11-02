const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: 'postgresql://postgres:Vamsi@123@localhost:5001/mydb' });
  try {
    await c.connect();
    const res = await c.query("select table_name from information_schema.tables where table_schema='public'");
    console.log(res.rows.map(r => r.table_name).join('\n'));
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  } finally {
    await c.end();
  }
})();
