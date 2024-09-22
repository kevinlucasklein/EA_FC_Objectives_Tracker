import express from 'express';
import { config } from 'dotenv';
import { router } from './routes';

config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});