const sqlite3 = require('sqlite3')
sqlite3.Database
//sqlite database for loginPass
const createDbForLoginPasswords = ()=> {
    const newdb = new sqlite3.Database('passwords.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
  }
const createTables = (newdb) => {
    newdb.exec(`
    create table pass (
        id int primary key not null,
        email text not null,
        password text not null
    );
    insert into pass (id,email, password)
        values (1,'abakar@techrivers.com','abakarHR@@123');
      `)
}

module.exports={createDbForLoginPasswords}