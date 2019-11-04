const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

async function getTable() {
  const result = await pool.query('SELECT * FROM participantdata ORDER BY id ASC')
  return result.rows;
}

async function getDataByUser(id) {
  const query = {
    text: 'SELECT * FROM participantdata WHERE participantid = $1',
    values: [id]
  }
  const result = await pool.query(query)
  return result.rows;
}

async function postData(id, data) {
  const query = {
    text: 'INSERT INTO participantdata(participantid, sessiondata) VALUES($1, $2)',
    values: [id, data]
  }
  success = await pool.query(query) 
    .then(() => {return true})
    .catch(() => {return false});
  
  if (!success) {
    throw new Error("Error inserting to db")
  }
}

module.exports = {
    getTable,
    getDataByUser, 
    postData
}