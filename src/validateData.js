import { OperationType, UserType } from './types.js';

export const validateDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Unsupported date format: "${date}"`);
  }
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Unsupported date format: "${date}"`);
  }
};

export const validateUserId = (id) => {
  if (typeof id !== 'number') {
    throw new Error(`Unsupported user_id format: "${id}"`);
  }
  if (Number.isNaN(id)) {
    throw new Error(`Unsupported user_id format: "${id}"`);
  }
};

export const validateUserType = (userType) => {
  if (!Object.values(UserType).includes(userType)) {
    throw new Error(`Unsupported user_type format: "${userType}"`);
  }
};

export const validateOperationType = (userType) => {
  if (!Object.values(OperationType).includes(userType)) {
    throw new Error(`Unsupported operation type format: "${userType}"`);
  }
};

export const validateOperationParams = ({ amount, currency }) => {
  if (currency !== 'EUR') {
    throw new Error(`Unsupported operation currency: "${currency}"`);
  }
  if (typeof amount !== 'number') {
    throw new Error(`Unsupported operation amount: "${amount}"`);
  }
  if (amount < 0 || Number.isNaN(amount)) {
    throw new Error(`Unsupported operation amount: "${amount}"`);
  }
};

export const validateInputData = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Unsupported data format. Data should be an array.');
  }
  data.forEach((entry) => {
    validateDate(entry.date);
    validateUserId(entry.user_id);
    validateUserType(entry.user_type);
    validateOperationType(entry.type);
    validateOperationParams(entry.operation);
  });
};
