const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.PSYCH_DATABASE_USER,
  host: process.env.PSYCH_DATABASE_HOST,
  database: process.env.PSYCH_DATABASE_NAME,
  password: process.env.PSYCH_DATABASE_PASSWORD,
  port: process.env.PSYCH_DATABASE_PORT,
})

async function updateConfig(newConfig) {

  const query = {
      text: "UPDATE configdata SET configJSON = $1 WHERE configid='default'",
      values: [JSON.stringify(newConfig)]
  }

  success = await pool.query(query) 
    .then(() => {return true})
    .catch((e) => {
      console.log(e);
      return false;
    });
  
  if (!success) {
    throw new Error("Error updating the db")
  }
  return success
}

async function getConfig() {
  const result = await pool.query("SELECT * from configdata WHERE configid='default' LIMIT 1")
    .then((res) => {
      return res.rows[0];
    }).catch((e) => {
      console.log(e);
      return null;
    });

    if (result === null) {
      throw new Error("Error reading from the db")
    }
    
    return result;
}

async function getTable() {
  const result = await pool.query('SELECT * FROM participantdata ORDER BY id ASC')
    .then((res) => {
      return res.rows;
    }).catch((e) => {
      console.log(e);
      return null;
    });

  if (result === null) {
    throw new Error("Error reading from the db")
  }
  return result;
}

async function getDataByUser(id) {
  const query = {
    text: 'SELECT * FROM participantdata WHERE participantid = $1',
    values: [id]
  }
  const result = await pool.query(query)
    .then((res) => {
      return res.rows;
    }).catch((e) => {
      console.log(e);
      return null;
    });

  if (result === null) {
    throw new Error("Error reading from the db")
  }
  return result;
}

async function postData(id, data) {
  // TODO: Enforce session data is JSON
  const query = {
    text: 'INSERT INTO participantdata(participantid, sessiondata) VALUES($1, $2)',
    values: [id, data]
  }
  success = await pool.query(query) 
    .then(() => {return true})
    .catch((e) => {
      console.log(e);
      return false;
    });
  
  if (!success) {
    throw new Error("Error inserting to db")
  }
  return success;
}

async function getPasswordForUser(username) {
  const query = {
    text: 'SELECT password, verified FROM authdata WHERE username = $1',
    values: [username]
  }

  const result = await pool.query(query)
    .then((res) => {
      return res.rows;
    }).catch((e) => {
      console.log(e);
      return null;
    });

  if (result === null) {
    throw new Error("Error reading from the db")
  }
  
  if (result.length == 1) {
    if (result[0].verified) {
      return result[0].password;
    } else {
      return '';
    }
  } else if (result.length == 0) {
    return '';
  } else {
    throw new Error("Invalid number of rows returned")
  }
}

async function updatePasswordForUser(username, password) {
  const query = {
    text: "UPDATE authdata SET password = $1 WHERE username=$2",
    values: [password, username]
  }

  success = await pool.query(query) 
    .then(() => {return true})
    .catch((e) => {
      console.log(e);
      return false;
    });
  
  if (!success) {
    throw new Error("Error updating the db")
  }
  return success
}

async function insertAuthInfo(username, password) {
  const query = {
    text: 'INSERT INTO authdata(username, password) VALUES ($1, $2)',
    values: [username, password]
  }

  success = await pool.query(query) 
  .then(() => {return true})
  .catch((e) => {
    console.log(e);
    return false;
  });

  if (!success) {
    throw new Error("Error inserting to db")
  }
  return success;
}

module.exports = {
    getTable,
    getDataByUser, 
    postData,
    updateConfig,
    getConfig,
    getPasswordForUser,
    insertAuthInfo,
    updatePasswordForUser
}