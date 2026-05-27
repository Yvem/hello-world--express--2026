import express from 'express'
import morgan from 'morgan'

import ⳇadmin from './router--admin/index.ts'
import ⳇapi from './router--api/index.ts'

/////////////////////////////////////////////////

const app = express();

app.use(morgan('dev')) // https://github.com/expressjs/morgan#predefined-formats

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/admin', ⳇadmin);
app.use('/api', ⳇapi);

/////////////////////////////////////////////////

const port = 3000;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
