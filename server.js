const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const config = require('./dbconfig');

const app = express();
app.use(cors());

app.get('/api/todo', async (req, res) => {
  const conn = await sql.connect(config);
  const data = await conn.request().query('select * from ToDoItems');
  res.json(data.recordset);
});

app.get('/api/todo/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const conn = await sql.connect(config);
  const data = await conn
    .request()
    .input('id', sql.Int, id)
    .query(`select * from ToDoItems where id = @id`);
  if (data.recordset.length === 0) {
    return res.status(404).send('sorry that id does not exsist for tasks');
  }
  res.json(data.recordset);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
