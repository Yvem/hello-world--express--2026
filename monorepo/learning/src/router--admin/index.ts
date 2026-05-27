
import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';
import express from 'express'
import type { Request, Response, NextFunction } from 'express';

import { SignJWT, jwtVerify } from 'jose'
import { secret } from '../consts.ts'

/////////////////////////////////////////////////

const adminUsername = 'admin' //process.env.ADMIN_USERNAME;
const adminPassword = 'admin' //process.env.ADMIN_PASSWORD;

const joseSecret = new TextEncoder().encode(secret)

/////////////////////////////////////////////////

const router = express.Router();
export default router;

let jwt: string | undefined = undefined
export function getJwt(userId: string): string {
	if (!jwt) throw new Error('jwt is not defined')

	return jwt
}

/////////////////////////////////////////////////

router.get('/', authenticate, async (req, res) => {
	jwt = await ↆgetꓽjwt(adminUsername)
	res.send(`Admin home page\njwt is now = ${jwt}`);
});

/////////////////////////////////////////////////

function authenticate (req: Request, res: Response, next: NextFunction)  {
	const header = req.headers.authorization;

	if (!header?.startsWith('Basic ')) {
		res.set('WWW-Authenticate', 'Basic realm="My App"');
		return res.status(401).json({ error: 'Authentication required' });
	}

	const credentials = header.slice('Basic '.length).trim();

	if (!credentials || !isBase64(credentials)) {
		return res.status(401).json({ error: 'Invalid authentication credentials' });
	}

	const decoded = Buffer.from(credentials, 'base64').toString('utf8');
	const separatorIndex = decoded.indexOf(':');

	if (separatorIndex === -1) {
		return res.status(401).json({ error: 'Invalid authentication credentials' });
	}

	const username = decoded.slice(0, separatorIndex);
	const password = decoded.slice(separatorIndex + 1);

	if (!adminUsername || !adminPassword) {
		return res.status(503).json({ error: 'Admin authentication is not configured' });
	}

	if (
		!timingSafeStringEqual(username, adminUsername) ||
		!timingSafeStringEqual(password, adminPassword)
	) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	next();
}

async function ↆgetꓽjwt(userId: string) {
	return await new SignJWT({ userId })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1h')
		.sign(joseSecret)
}

const isBase64 = (value: string) => {
	return /^[A-Za-z0-9+/]*={0,2}$/.test(value) && value.length % 4 !== 1;
};

const timingSafeStringEqual = (actual: string, expected: string) => {
	const actualHash = createHash('sha256').update(actual, 'utf8').digest();
	const expectedHash = createHash('sha256').update(expected, 'utf8').digest();

	return timingSafeEqual(actualHash, expectedHash);
};
