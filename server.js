import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import register from './controllers/register.js';
import {signinAuthentication} from './controllers/signin.js';
import {handleProfileGet, handleProfileUpdate} from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';
import morgan from 'morgan';
import requireAuth from './controllers/authorization.js';
import handleSignOut from './controllers/signout.js';
import redis from 'redis';

const redisClient = redis.createClient(process.env.REDIS_URI);

const db=knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app=express();
app.use(express.json());
app.use(morgan('combined'))
app.use(cors());

app.get('/',(req, res)=>{res.send('it is working')})
app.post('/signin', signinAuthentication(db, bcrypt)) //Dependency Injection
app.post('/register', register(db, bcrypt))
app.get('/profile/:id', requireAuth, (req, res)=>{handleProfileGet(req, res, db)})
app.post('/profile/:id', requireAuth, (req, res)=>{handleProfileUpdate(req, res, db)})
app.put('/image', requireAuth, (req, res)=>{handleImage(req, res, db)})
app.post('/imageurl', requireAuth, (req, res)=>{handleApiCall(req, res)})
app.put('/signout', requireAuth, (req, res)=>{handleSignOut(req, res)})

app.listen(80,()=>{
	console.log(`app is running on port 80`);
});

export default redisClient;
