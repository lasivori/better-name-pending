const users = require('../models/users-model');
const passport = require('../middlewares/passport-config');
const fs = require('fs')
const util = require('util')
const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-2"});

const s3 = new AWS.S3({params: {Bucket: 'bnp-games'}});

const writeFile = util.promisify(fs.writeFile)

const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

client.connect();

class UserControllers {
	// the 'isAuth' in any of these is generally to change if a
	// button in the navbar shows "Sign Up/Login" or "Profile"

	// simple get index, show front page. Nothing special here
	getIndex(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;	
		}
		response.render('index.ejs', {auth: isAuth});
	}

	// will have to setup queries to get list of games to show
	async getGames(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}
		var games = await client.query('SELECT * FROM games');
		response.render('games.ejs', {auth: isAuth, data: games})
	}
	async getGamePage(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}
		var game_id = parseInt(request.params.id);
		var game = {};
		game = await client.query('SELECT * FROM games WHERE game_id=$1 LIMIT 1', [game_id]);
		game = game.rows[0];
		var gamedata = {"game_id":game.game_id, "author": game.author, "title": game.title, "date_created": game.date_created, "gamefile": game.gamefile, "description": game.description, "reviews": game.reviews, "additional": game.additional};
		gamedata = JSON.stringify(gamedata);
		gamedata = gamedata.replace(/ /g,"_");
		gamedata = gamedata.replace(/\\/g, '\\\\');

		response.render('game.ejs', {auth: isAuth, data: gamedata, id: game_id});
	}
	getAddGame(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}
		response.render('addgame.ejs', {auth: isAuth});
	}
	async postAddGame(request, response) {

		// make sure that we even got files in the first place
		if(!request.files || Object.keys(request.files).length === 0) {
			return response.status(400).send('No files were uploaded.');
		}

		var author = request._passport.session.user;
		var title = request.body.title;
		var gamefiles = request.files.gamefiles;
		var desc = request.body.desc;
		var additional = {"images":[]};
		// for(let image in request.files.additional){
		// 	image.
		// }

		try {
			const upload = new AWS.S3.ManagedUpload({
				params: {
					Body: gamefiles.data,
					Key: `${author.toLowerCase()}/${gamefiles.name.toLowerCase()}`,

					ACL: 'public-read'
				},

				service: s3
			});

			const res = await upload.promise();
			var path = `${gamefiles.name.toLowerCase()}`;
			var reviews = {"contents":[]};
			await client.query('INSERT INTO games (author, title, date_created, gamefile, description, reviews, additional) VALUES ($1, $2, CURRENT_TIMESTAMP(0), $3, $4, $5, $6)', [author, title, path, desc, reviews, additional]);
		} catch (err) {
			console.log(err);
			response.send(err);
		}

		response.redirect('/games');
	}
	async getDownload(request, response) {
		var path = request.query.path.toLowerCase();
		var author = request.query.author.toLowerCase();
		path = path.replace(/ /g,"_");
		var pos = path.lastIndexOf('-');
		path = path.substring(0,pos) + '.' + path.substring(pos+1)
		var key = `${author}/${path}`;
		console.log(key);
		var params = {
			Key: key,
			Bucket: 'bnp-games'
		}

		response.attachment(`${path}`);
		var fileStream = s3.getObject(params).createReadStream();
		fileStream.pipe(response);
	}
	async postAddReview(request, response){
		var author = request._passport.session.user;
		var content = request.body.text;
		var currdate = new Date();
		var datetime = currdate.getFullYear() + "-" + (currdate.getMonth()+1) + "-" + currdate.getDate() + " " + currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds();
		var reviewJSON = {"author":author, "date":datetime, "content":content}

		var game_id = request.body.game_id

		var reviewsRes = await client.query('SELECT reviews FROM games WHERE game_id=$1', [game_id]);
		var reviews = reviewsRes.rows[0].reviews;
		reviews.contents.push(reviewJSON);

		await client.query('UPDATE games SET reviews=$1 WHERE game_id=$2', [reviews, game_id]);
		response.redirect(request.get('Referrer'));
	}


	async getForums(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}

		var forums = await client.query('SELECT * FROM threads ORDER BY date_created DESC');

		response.render('forums.ejs', {auth: isAuth, data: forums});
	}
	async getThread(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}

		var threadId = parseInt(request.params.id);
		var thread = await client.query('SELECT contents FROM threads WHERE thread_id=$1 LIMIT 1', [threadId]);
		thread = JSON.stringify(thread.rows[0].contents);
		thread = thread.replace(/ /g,"_");
		thread = thread.replace(/\\/g, '\\\\');

		response.render('thread.ejs', {auth: isAuth, data: thread, id: threadId});
	}
	getAddThread(request, response) {
		var isAuth = false;
		if (request.user){
			isAuth = true;
		}
		response.render('addthread.ejs', {auth: isAuth});
	}
	async postAddThread(request, response) {
		var author = request._passport.session.user;
		var title = request.body.title;
		var contents = request.body.text;
		var res = await client.query('SELECT COUNT(*) FROM threads');
		var id = res.rows[0].count;
		id++;

		var currdate = new Date();
		var datetime = currdate.getFullYear() + "-" + (currdate.getMonth()+1) + "-" + currdate.getDate() + " " + currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds();
		var contentsJSON = {
			"id":id, "title":title, "author":author, "date":datetime, "content":contents, "comments":[]
		}

		await client.query('INSERT INTO threads (author, date_created, contents) VALUES ($1, CURRENT_TIMESTAMP(0), $2)', [author, contentsJSON]);
		
		response.redirect(`/thread/${id}`);
	}
	async postAddComment(request, response) {
		var author = request._passport.session.user;
		var commentText = request.body.text;
		var thread_id = request.body.thread_id;


		var currdate = new Date();
		var datetime = currdate.getFullYear() + "-" + (currdate.getMonth()+1) + "-" + currdate.getDate() + " " + currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds();
		var thread = await client.query('SELECT contents FROM threads WHERE thread_id=$1', [thread_id]);
		var threadcontents = thread.rows[0].contents;
		
		var commentCount = 1;
		for(let comment of threadcontents.comments){
			commentCount++;
			replyCount(comment);
		}

		function replyCount(comment) {
			if (comment.comments) {
				for (let reply of comment.comments) {
					commentCount++;
					replyCount(reply)
				}
			}
		}

		var comment = {"id":commentCount, "author":author, "date": datetime, "content":commentText, "comments":[]};
		thread = thread.rows[0].contents;
		thread.comments.push(comment);

		await client.query('UPDATE threads SET contents=$1 WHERE thread_id=$2', [thread, thread_id])
		response.redirect(`/thread/${thread_id}`);
	}
	async postAddReply(request, response) {
		// get basic reply info: author, text, parent_id (to attach reply)
		var author = request._passport.session.user;
		var replyText = request.body.text;
		var reply_parent_id = request.body.parent_id;

		// need thread_id to get back on redirect, and also to access thread contents
		var thread_id = request.body.thread_id;
		var thread = await client.query('SELECT contents FROM threads WHERE thread_id=$1', [thread_id]);
		var threadcontents = thread.rows[0].contents;

		// get comment ID (based on how many comments are already there + 1)
		var commentCount = 1;
		for(let comment of threadcontents.comments){
			commentCount++;
			replyCount(comment);
		}
		function replyCount(comment) {
			if (comment.comments) {
				for (let reply of comment.comments) {
					commentCount++;
					replyCount(reply)
				}
			}
		}
		//get current date
		var currdate = new Date();
		var datetime = currdate.getFullYear() + "-" + (currdate.getMonth()+1) + "-" + currdate.getDate() + " " + currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds();
		// form reply
		var reply = {"id":commentCount, "author":author, "date": datetime, "content":replyText, "comments":[]}

		// attach to parent
		findParent(threadcontents);
		function findParent(contents){
			var i = 0;
			var replyadded = false;
			while ((i < contents.comments.length) && !replyadded) {
				console.log('findParent: ', i);
				console.log(contents);
				if (contents.comments[i].id == reply_parent_id) {
					console.log('findParent, on comment: ', contents.comments[i].id);
					contents.comments[i].comments.push(reply);
					replyadded = true;
					console.log(contents.comments[i]);
					return replyadded;
				}
				replyadded = findParent(contents.comments[i]);
				i++;
			}

			return false;
		}

		await client.query('UPDATE threads SET contents=$1 WHERE thread_id=$2', [threadcontents, thread_id])
		response.redirect(`/thread/${thread_id}`);
	}


	getProfile(request, response) {
		response.render('profile.ejs');
	}
	getSignUp(request, response) {
		response.render('signup.ejs');
	}
	postLogin(request, response, next) {
		const config = {};
		config.successRedirect = '/';
		config.failureRedirect = '/signup';
		config.failureFlash = true;
		const authHandler = passport.authenticate('local', config);
		authHandler(request, response, next);
	}
	postSignUp(request, response) {
		try{
			const {name, email, password} = request.body;
			users.add(name, email, password);
			response.redirect('/');
		} catch{
			response.redirect('/signup');
		}
	}
	postLogout(request, response) {
		request.logOut();
		response.redirect('/');
	}
}

module.exports = new UserControllers();