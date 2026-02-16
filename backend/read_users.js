const db = require('./database');

db.all('SELECT id, username, email, bio, password FROM users', [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('User Data:');
        console.log(JSON.stringify(rows, null, 2));
    }
});
