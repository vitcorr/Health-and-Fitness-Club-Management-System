const pug = require("pug");
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Client } = require('pg');
const app = express();

// PostgreSQL connection
const db = new Client({
		connectionString: 'postgres://postgres:Calcium02@localhost:5432/project_1',
});

db.connect()
		.then(() => console.log('Connected to PostgreSQL database'))
		.catch(error => console.error('Error connecting to the database:', error));

// Configure session middleware
const sessionMiddleware = session({
	store: new pgSession({
		pool: db,
		tableName: 'sessions', 
		schemaName: 'public',
		createTableIfMissing: true,
		ttl: 86400, 
		pruneSessionInterval: 86400,
		errorIfSessionNotFound: false,
		loggedin: false,
}),
		secret: 'secret', 
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 1000*60*60 },
});

app.use(sessionMiddleware);
app.set("view engine", "pug");
app.use(exposeSession);
app.use(express.static("public"));
app.use(express.json()); 

//exposes session information to all the pages
function exposeSession(req, res, next) {
    if (req.session) {
        res.locals.session = req.session;;
    }
    next();
}

//GET request for home page
app.get(["/", "/home"], (req, res) => { 
    console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/index");
});

//GET request that renders login page
app.get("/login", (req, res)=> { 
	console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/whoareyou");
});

//GET request for trainers  page
app.get("/trainers", async(req, res)=> { 
	console.log(req.method + " " + req.url);
	const result1 = await db.query('SELECT * FROM users WHERE type_of_user = 2');
	const trainers = result1.rows;
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/trainers", {trainers});
});

//POST request that logs in as trainer
app.post("/trainers", async (req, res) => {
    console.log(req.method + " " + req.url);
    if (req.body.username == "") {
        res.status(400);
        res.send("no username");
    } else if (req.body.password == "") {
        res.status(400);
        res.send("no password");
    } else if (req.body.first_name == "") {
        res.status(400);
        res.send("no first");
    } else if (req.body.last_name == "") {
        res.status(400);
        res.send("no last");
    } else if (req.body.email == "") {
        res.status(400);
        res.send("no email");
    } else if (req.body.phone_num == "") {
        res.status(400);
        res.send("no phone");
    } else if (req.body.sex == "") {
        res.status(400);
        res.send("no sex");
    } else if (req.body.dob == "") {
        res.status(400);
        res.send("no dob");
    } else if (req.body.home_addr == "") {
        res.status(400);
        res.send("no address");
		return;
    } else {
        const { username, password, first_name, last_name, email, phone_num, sex, dob, home_addr } = req.body;
        const result1 = await db.query('SELECT * FROM users WHERE username = $1', [
			username,
        ]);
		if (result1.rows.length > 0) {
			res.status(400);
            res.send("already");
		} else {
			try {
				const result = await db.query('INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES (2, $1, $2, $3, $4, $5, $6, $7, $8, $9)', [
					username,
					password,
					first_name,
					last_name,
					email,
					phone_num,
					sex,
					dob,
					home_addr,
				]);
			} catch (error) {
				res.status(400);
            	res.send("error");
			}
			return res.status(200).send();
		}
    }
});

//GET request for member login
app.get("/memberlogin", (req, res)=> { 
	console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/memberlogin");
});

//POST request that logs in as member
app.post("/memberlogin", async (req, res)=> { 
	console.log(req.method + " " + req.url);
	if (req.session.loggedin) {
		res.status(400);
		console.log("already logged in")
		res.send("already logged in")
		return;
	}

	if (req.body.username === '') {
		res.status(400);
		res.send("no username");
	} else if (!req.body.password || req.body.password === '') {
		res.status(400);
		res.send("no password");
	} else {
		const { username, password } = req.body;
        const result1 = await db.query('SELECT * FROM users WHERE username = $1 AND type_of_user = 1', [
			username,
        ]);
		if (result1.rows.length > 0) {
			const result2 = await db.query('SELECT * FROM users WHERE username = $1 AND password_key = $2', [
				username,
				password,
			]);
			if (result2.rows.length > 0) {
				userId = result2.rows[0].user_id;
				const jsonString = '%7B"userId":' + userId + '%7D';
				req.session.user_id = jsonString;
				req.session.loggedin = true;
				req.session.type = 2;
				req.session.username = username;
				
				return res.status(200).send({userId});
			} else {
				res.status(400);
				res.send("not right password");
			}
		} else {
			res.status(400);
			res.send("username doesn't exist");
			return;
		}
	}
});

//GET request for trainer login
app.get("/trainerlogin", (req, res)=> { 
    console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/trainerlogin");
});

//POST request that logs in as trainer
app.post("/trainerlogin", async (req, res)=> { 
	console.log(req.method + " " + req.url);

	if (req.session.loggedin) {
		res.status(400);
		console.log("already logged in")
		res.send("already logged in")
		return;
	}

	if (req.body.username === '') {
		res.status(400);
		res.send("no username");
		return;
	} else if (!req.body.password || req.body.password === '') {
		res.status(400);
		res.send("no password");
		return;
	} else {
		const { username, password } = req.body;
        const result1 = await db.query('SELECT * FROM users WHERE username = $1 AND type_of_user = 2', [
			username,
        ]);
		if (result1.rows.length > 0) {
			const result2 = await db.query('SELECT * FROM users WHERE username = $1 AND password_key = $2', [
				username,
				password,
			]);
			if (result2.rows.length > 0) {
				userId = result2.rows[0].user_id;
				const jsonString = '%7B"userId":' + userId + '%7D';
				req.session.user_id = jsonString;
				req.session.loggedin = true;
				req.session.type = 2;
				req.session.username = username;
				
				return res.status(200).send({userId});
			} else {
				res.status(400);
				res.send("not right password");
				return;
			}
		} else {
			res.status(400);
			res.send("username doesn't exist");
			return;
		}
	}
});

//GET request for admin login
app.get("/adminlogin", (req, res)=> { 
    console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/adminlogin");
});

//POST request that logs in as admin
app.post("/adminlogin", async (req, res)=> { 
	console.log(req.method + " " + req.url);

	if (req.session.loggedin) {
		res.status(400);
		console.log("already logged in")
		res.send("already logged in")
		return;
	}

	if (req.body.username === '') {
		res.status(400);
		res.send("no username");
	} else if (!req.body.password || req.body.password === '') {
		res.status(400);
		res.send("no password");
	} else {
		const { username, password } = req.body;
        const result1 = await db.query('SELECT * FROM administration WHERE username = $1', [
			username,
        ]);
		if (result1.rows.length > 0) {
			const result2 = await db.query('SELECT * FROM administration WHERE username = $1 AND password_key = $2', [
				username,
				password,
			]);
			if (result2.rows.length > 0) {
				userId = result2.rows[0].admin_id;
				const jsonString = '%7B"userId":' + userId + '%7D';
				req.session.user_id = jsonString;
				req.session.loggedin = true;
				req.session.type = 1;
				req.session.username = username;
				return res.status(200).send({userId});
			} else {
				res.status(400);
				res.send("not right password");
			}
		} else {
			res.status(400);
			res.send("username doesn't exist");
		}
	}
});

//GET request for member registration
app.get("/memberregister", (req, res)=> { 
    console.log(req.method + " " + req.url);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/memberregister");
});

//POST request that creates and adds new member
app.post("/memberregister", async (req, res) => {
    console.log(req.method + " " + req.url);
    if (req.session.loggedin) {
        res.status(400);
        res.send("already logged in")
        return;
    }
    if (req.body.username == "") {
        res.status(400);
        res.send("no username");
    } else if (req.body.password == "") {
        res.status(400);
        res.send("no password");
    } else if (req.body.first_name == "") {
        res.status(400);
        res.send("no first");
    } else if (req.body.last_name == "") {
        res.status(400);
        res.send("no last");
    } else if (req.body.email == "") {
        res.status(400);
        res.send("no email");
    } else if (req.body.phone_num == "") {
        res.status(400);
        res.send("no phone");
    } else if (req.body.sex == "") {
        res.status(400);
        res.send("no sex");
    } else if (req.body.dob == "") {
        res.status(400);
        res.send("no dob");
    } else if (req.body.home_addr == "") {
        res.status(400);
        res.send("no address");
		return;
    } else {
        const { username, password, first_name, last_name, email, phone_num, sex, dob, home_addr } = req.body;
        const result1 = await db.query('SELECT * FROM users WHERE username = $1', [
			username,
        ]);
		if (result1.rows.length > 0) {
			res.status(400);
            res.send("already");
		} else {
			try {
				const result = await db.query('INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)', [
					username,
					password,
					first_name,
					last_name,
					email,
					phone_num,
					sex,
					dob,
					home_addr,
				]);
			} catch (error) {
				res.status(400);
            	res.send("error");
			}
			const result2 = await db.query('SELECT * FROM users WHERE username = $1 AND password_key = $2', [
				username,
				password,
			]);
			userId = result2.rows[0].user_id;
				const jsonString = '%7B"userId":' + userId + '%7D';
				req.session.user_id = jsonString;
				req.session.loggedin = true;
				req.session.type = 2;
				req.session.username = username;
				return res.status(200).send();
		}
    }
});

//GET request for a users page
app.get("/profile/:user_id", async (req, res)=> {
	console.log(req.method + " " + req.url);
	const oid = req.params.user_id;
	console.log(JSON.parse(oid).userId)
	const userid = oid.split(":")[1].split("}")[0];
	const pdresults = await db.query('SELECT * FROM users WHERE user_id = $1', [
		userid,
	]);
	const hmresults = await db.query('SELECT * FROM metrics WHERE member_id = $1 ORDER BY new_date DESC', [
		userid,
	]);
	const erresults = await db.query('SELECT * FROM routines WHERE member_id = $1', [
		userid,
	]);
	const pdinfo = pdresults.rows[0];
	const hminfo = hmresults.rows;
	const erinfo = erresults.rows;
	console.log(erinfo);
	const url = req.url.split("/")[2];
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/profile", {pdinfo, hminfo, erinfo, url});
});

//POST request that updates user's personal information
app.post("/profile/:userID", async (req, res)=> {
	console.log(req.method + " " + req.url);
	const oid = req.params.userID;
	const userid = oid.split(":")[1].split("}")[0];
	const pdresults = await db.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_num = $4, sex = $5, dob = $6, home_addr = $7 WHERE user_id = $8', [
		req.body.first_name,
		req.body.last_name,
		req.body.email,
		req.body.phone_num,
		req.body.sex,
		req.body.dob,
		req.body.home_addr,
		userid,
	]);
	res.locals.session = req.session;
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.send(userid);
});

//GET request for adding new attribute to user account
app.get("/addnew/:user_id", async (req, res)=> {
	console.log(req.method + " " + req.url);
	const oid = req.params.user_id;
	const userid = oid.split(":")[1].split("}")[0];
	const results = await db.query('SELECT * FROM metrics WHERE member_id = $1 ORDER BY new_date DESC', [
		userid,
	]);
	if (results.rows.length === 0) {
		let original = { new_weight: 0, height: 0 };
		results.rows.push(original);
	}
	const info = results.rows[0];
	const url = req.url.split("/")[2];
	const type = 1;
	console.log(results.rows);
	res.statusCode = 200;
	res.setHeader("Content-Type","text/html");
	res.render("pages/addnew", {type, info, url});
});

//POST request that adds new record to the user's attribute
app.post("/addnew/:user_id", async (req, res)=> {
	console.log(req.method + " " + req.url);
	console.log(req.body);
	const oid = req.params.user_id;
	const userid = oid.split(":")[1].split("}")[0];
	if (req.body.type === '1') { //metric
		const results = await db.query('INSERT INTO metrics(member_id, new_weight, height) VALUES ($1, $2, $3)', [
			userid,
			req.body.new_weight,
			req.body.height,
		]);
	} else if (req.body.type === '2') {

	} else if (req.body.type === '3') {

	}
	res.locals.session = req.session;
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.send(userid);
});

//GET request that renders logout page
app.get("/logout", (req, res) => {
    console.log(req.method + " " + req.url);
    if (req.session.loggedin) {
        res.status(200);
        res.setHeader("Content-Type","text/html");
        res.render("pages/logout");
    } else {
        res.status(403);
        res.send();
    }
});

//POST request that signs out user if they are logged in
app.post("/logout", (req, res) => {
    console.log(req.method + " " + req.url);
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.destroy();
        res.locals.session = req.session;
        res.status(200);
        res.send();
    } else {
        res.status(400);
        res.send("already logged out")
        return;
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}/login`);
});


