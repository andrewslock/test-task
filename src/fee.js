import { OperationType, UserType } from './types.js';

/*  Rounds up to fixed 2 digits
    For example,
    round(0.01)         -> 0.01
    round(0.001)        -> 0.01
    round(2.491)        -> 2.50
    round(2.490000001)  -> 2.50
*/
export const round = (number) => {
  const [wholePart, fractionPart] = number.toString().split('.');
  if (!fractionPart) return number;
  const needsToBeRounded = fractionPart.length > 2;
  if (!needsToBeRounded) return number;
  const numberFixed2 = Number(`${wholePart}.${fractionPart.slice(0, 2)}`);
  return numberFixed2 + 0.01;
};

const MILLISECONDS_IN_A_WEEK = 7 * 24 * 60 * 60 * 1000;
const FIRST_WEEK_START = new Date('1970-01-05').getTime();

/*  Calculates the number of a week since 1970-01-05
    For example,
    1970-01-10 is Saturday  ( week #0 )
    1970-01-11 is Sunday    ( week #0 )
    1970-01-12 is Monday    ( week #1 )
    1970-01-13 is Tuesday   ( week #1 )
    and so on...
*/
export const getWeekNumber = (date) => Math.floor(
  (date.getTime() - FIRST_WEEK_START) / MILLISECONDS_IN_A_WEEK,
);

export const calculateFee = (inputData, feeConfig) => {
  /*  Contains data of how much every natural user has withdrawn cash per week
        {
            [weekNumber]: {
                [userId]: withdrawnAmount;
            }
        }
    */
  const userPerWeekWithdrawnAmount = {};

  const fees = inputData.map((entry) => {
    /* If the operation is CashIn */
    if (entry.type === OperationType.CashIn) {
      return Math.min(
        (entry.operation.amount * feeConfig.cashIn.percents) / 100,
        feeConfig.cashIn.max.amount,
      );
    }
    /* If the user is Juridical */
    if (entry.user_type === UserType.Juridical) {
      return Math.max(
        (entry.operation.amount * feeConfig.cashOutJuridical.percents) / 100,
        feeConfig.cashOutJuridical.min.amount,
      );
    }
    /* If the user is Natural & operation is CashOut */
    const weekNumber = getWeekNumber(new Date(entry.date));
    if (!userPerWeekWithdrawnAmount[weekNumber]) {
      userPerWeekWithdrawnAmount[weekNumber] = {};
    }
    const withdrawnThisWeek = userPerWeekWithdrawnAmount[weekNumber];

    if (!withdrawnThisWeek[entry.user_id]) {
      withdrawnThisWeek[entry.user_id] = 0;
    }

    const weekLimit = feeConfig.cashOutNatural.week_limit.amount;

    if (withdrawnThisWeek[entry.user_id] + entry.operation.amount >= weekLimit) {
      if (withdrawnThisWeek[entry.user_id] >= weekLimit) {
        withdrawnThisWeek[entry.user_id] += entry.operation.amount;
        return (entry.operation.amount * feeConfig.cashOutNatural.percents) / 100;
      }
      const leftLimit = weekLimit - withdrawnThisWeek[entry.user_id];
      withdrawnThisWeek[entry.user_id] += entry.operation.amount;
      return ((entry.operation.amount - leftLimit) * feeConfig.cashOutNatural.percents) / 100;
    }

    withdrawnThisWeek[entry.user_id] += entry.operation.amount;
    return 0;
  });

  return fees.map(round);
};

// module.exports = {
//     getWeekNumber,
//     round,
//     calculateFee
// }
