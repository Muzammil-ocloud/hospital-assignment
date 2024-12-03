import { bitcoinToFiat } from "bitcoin-conversion";

export const getAmountInUSD = async (amount: number, paymentMethod: string): Promise<number> => {
  if (paymentMethod === "Bitcoin") {
    return await bitcoinToFiat(amount, "USD");
  }

  if (paymentMethod === "EUR") {
    return convertEuroToUSD(amount);
  }

  return amount;
};

const convertEuroToUSD = (amount: number): number => {
  return amount * 1.0552;
};
