import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/routes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

app.listen(5000, () => console.log('SwiftAid backend running on port 5000'));
