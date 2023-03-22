import * as fs from 'fs/promises';
import JSON5 from 'json5';

import { validateInputData } from './validateData.js';
import { getFeeConfig } from './api.js';
import { calculateFee } from './fee.js';

export default async (fileName) => {
  console.info('Validating input data...');

  const inputData = JSON5.parse(await fs.readFile(fileName, 'utf-8'));
  validateInputData(inputData);

  console.info('Fetching current fee config...');

  const config = await getFeeConfig();

  const result = calculateFee(inputData, config);

  console.info('Outputting result...');
  result.forEach((fee) => console.log(fee));
};
