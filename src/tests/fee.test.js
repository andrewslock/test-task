import { getWeekNumber, calculateFee, round } from '../fee';

describe('GetWeekNumber function', () => {
  test('Week #0', () => {
    const date = new Date('1970-01-11');
    expect(getWeekNumber(date)).toBe(0);
  });

  test('Week #1', () => {
    const date = new Date('1970-01-12');
    expect(getWeekNumber(date)).toBe(1);
  });

  test('Week #10', () => {
    const date = new Date('1970-03-19');
    expect(getWeekNumber(date)).toBe(10);
  });
});

describe('CalculateFee function', () => {
  test('CashIn', () => {
    const operation = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: {
        amount: 13.45,
        currency: 'EUR',
      },
    };
    const config = {
      cashIn: { percents: 0.1, max: { amount: 5, currency: 'EUR' } },
    };
    expect(calculateFee([operation], config)).toEqual([0.02]);
  });

  test('CashIn max', () => {
    const operation = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: {
        amount: 1200000.00,
        currency: 'EUR',
      },
    };
    const config = {
      cashIn: { percents: 0.1, max: { amount: 5, currency: 'EUR' } },
    };
    expect(calculateFee([operation], config)).toEqual([5]);
  });

  test('CashOut Juridical', () => {
    const operation = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash_out',
      operation: {
        amount: 1000000.00,
        currency: 'EUR',
      },
    };
    const config = {
      cashOutJuridical: { percents: 0.1, min: { amount: 28, currency: 'EUR' } },
    };
    expect(calculateFee([operation], config)).toEqual([1000]);
  });

  test('CashOut Juridical min', () => {
    const operation = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'juridical',
      type: 'cash_out',
      operation: {
        amount: 100.00,
        currency: 'EUR',
      },
    };
    const config = {
      cashOutJuridical: { percents: 0.1, min: { amount: 28, currency: 'EUR' } },
    };
    expect(calculateFee([operation], config)).toEqual([28]);
  });

  test('CashOut Natural simple', () => {
    const operation = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 100.00,
        currency: 'EUR',
      },
    };
    const config = {
      cashOutNatural: { percents: 0.1, week_limit: { amount: 100, currency: 'EUR' } },
    };
    expect(calculateFee([operation], config)).toEqual([0]);
  });

  test('CashOut Natural simple', () => {
    const operation1 = {
      date: '2023-03-18',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 100.00,
        currency: 'EUR',
      },
    };
    const operation2 = {
      date: '2023-03-19',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 100.00,
        currency: 'EUR',
      },
    };
    const config = {
      cashOutNatural: { percents: 0.1, week_limit: { amount: 100, currency: 'EUR' } },
    };
    expect(calculateFee([operation1, operation2], config)).toEqual([0, 0.1]);
  });
});

describe('Round function', () => {
  test('Without round', () => {
    const number = 1.55;
    expect(round(number)).toBe(number);
  });

  test('With round', () => {
    const number = 1.551;
    expect(round(number)).toBe(1.56);
  });
});
