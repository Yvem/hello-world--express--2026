
import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';
import express from 'express'
import type { Request, Response, NextFunction } from 'express';

import { jwtVerify } from 'jose'
import { secret } from '../consts.ts'

/////////////////////////////////////////////////

const username = 'admin' //process.env.ADMIN_USERNAME;

const joseSecret = new TextEncoder().encode(secret)

/////////////////////////////////////////////////

const router = express.Router();
export default router;

/////////////////////////////////////////////////

router.all('/foo', authenticate, async (req, res) => {
	//console.log(req)
	res.send(`${req.method} /foo endpoint`);
});

/////////////////////////////////////////////////

async function authenticate (req: Request, res: Response, next: NextFunction)  {
	const header = req.headers.authorization;
	if (!header?.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No token provided' });
	}

	const token = header.split(' ')[1];

	try {
		const decoded = await jwtVerify(token, joseSecret);
		console.log(decoded)
		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ error: 'Invalid or expired token' });
	}

	next();
}
