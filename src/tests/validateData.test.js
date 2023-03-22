import {
  validateDate, validateUserId, validateUserType, validateOperationParams,
} from '../validateData.js';

describe('ValidateDate function', () => {
  test('Wrong date', () => {
    const date = '123';
    expect(() => validateDate(date)).toThrow(Error);
  });

  test('Correct date', () => {
    const date = '1999-10-10';
    expect(() => validateDate(date)).not.toThrow(Error);
  });
});

describe('ValidateUserId function', () => {
  test('Wrong id', () => {
    const id = 'abc';
    expect(() => validateUserId(id)).toThrow(Error);
  });

  test('Correct id', () => {
    const id = 5;
    expect(() => validateUserId(id)).not.toThrow(Error);
  });
});

describe('ValidateUserType function', () => {
  test('Wrong type', () => {
    const type = 'legal';
    expect(() => validateUserType(type)).toThrow(Error);
  });

  test('Correct type Natural', () => {
    const type = 'natural';
    expect(() => validateUserType(type)).not.toThrow(Error);
  });

  test('Correct type Juridical', () => {
    const type = 'juridical';
    expect(() => validateUserType(type)).not.toThrow(Error);
  });
});

describe('ValidateOperationParams function', () => {
  test('Wrong params amount negative', () => {
    const params = {
      amount: -10,
      currency: 'EUR',
    };
    expect(() => validateOperationParams(params)).toThrow(Error);
  });

  test('Wrong params amount string', () => {
    const params = {
      amount: '100',
      currency: 'EUR',
    };
    expect(() => validateOperationParams(params)).toThrow(Error);
  });

  test('Wrong params currency', () => {
    const params = {
      amount: 100,
      currency: 'USD',
    };
    expect(() => validateOperationParams(params)).toThrow(Error);
  });

  test('Correct params', () => {
    const params = {
      amount: 100,
      currency: 'EUR',
    };
    expect(() => validateOperationParams(params)).not.toThrow(Error);
  });
});
