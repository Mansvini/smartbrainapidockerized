import {getAuthTokenId, createSession } from './signin.js';

const handleRegister=(req, res, db, bcrypt)=>{
	const {name, email, password}=req.body;
	if(!email || !name || !password){
		return Promise.reject('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);

	return db.transaction(trx =>{
		trx.insert({
			email:email,
			hash:hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail=>{
			return trx('users')
			.returning('*')
			.insert({
				name:name,
				email:loginEmail[0].email,
				joined: new Date()
			})
				.then(response=> {
					return response[0]})
		})
			.then(trx.commit)
			.catch(trx.rollback)
	})
		.catch(err=>Promise.reject('unable to register'))
}

const register=(db, bcrypt)=>(req, res)=>{
	const {authorization} =req.headers;
	return authorization? getAuthTokenId(req, res) :
		handleRegister(req, res, db, bcrypt)
		.then (data=>{
			return data.id && data.email ? createSession(data) : Promise.reject(data)
		})
		.then (session=> {
			res.json(session)})
		.catch(err=>res.status(400).json(err))
}

export default register;