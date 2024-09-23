import express, { Application } from 'express';
import { config } from 'dotenv';
import { router } from './routes';

config(); // Load environment variables

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});