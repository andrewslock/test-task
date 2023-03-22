/* import .env variables */
import * as dotenv from 'dotenv';

import start from './src/index.js';

dotenv.config();

/* Get input arguments */
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Use: node app.js [filename]');
  process.exit(1);
}

const fileName = args[0];
start(fileName);
