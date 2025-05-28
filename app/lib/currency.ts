export const USD_TO_EGP = 30.9;

export const formatPrice = (price: number): string => {
  return `EGP ${price.toFixed(2)}`;
};

export const convertToEGP = (price: number): number => {
  return price;
}; 