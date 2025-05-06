import dotenv from 'dotenv';
import server from './app.js';

dotenv.config();

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
