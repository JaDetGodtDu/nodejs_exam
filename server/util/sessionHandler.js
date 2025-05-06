import session from 'express-session';

import 'dotenv/config';


const sessionHandler = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});

export default sessionHandler;