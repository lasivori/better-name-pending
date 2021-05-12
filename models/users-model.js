const shortid = require('shortid');
const bcrypt = require('bcrypt');

const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

client.connect();

class Users {
	constructor() {
		this.users = [];
	}

	async add(username, email, password) {
		const id = shortid.generate();
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = {id:id, username:username, email:email, password:hashedPassword};
		this.users.push(user);
		console.log(this.users);

		client.query('INSERT INTO users(username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email], (err, res) => {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log(res);
		});
	}

	async findUser(key, value) {
		if(key = 'email'){
			var userJSON = await client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [value])
		} else if (key = 'username'){
			var userJSON = await client.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [value])
		} else if(key = "user_id"){
			var userJSON = await client.query('SELECT * FROM users WHERE user_id=$1 LIMIT 1', [value])
		}
		const user = userJSON.rows[0];
		return user;
	}
}

module.exports = new Users();