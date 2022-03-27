import redisClient from '../server.js';

const handleSignOut=((req, res)=>{
    const {authorization}=req.headers;
    redisClient.del(authorization);
    res.json('successfully logged out');
})

export default handleSignOut;