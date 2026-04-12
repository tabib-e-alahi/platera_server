// src/utils/discount.util.ts

interface IDiscountResult {
  effectivePrice: number;
  discountPrice: number | null;
  discountPercentage: number | null;
  isDiscountActive: boolean;
  discountStartDate: Date | null;
  discountEndDate: Date | null;
}

export const computeDiscount = (meal: {
  basePrice: number;
  discountPrice: number | null;
  discountStartDate: Date | null;
  discountEndDate: Date | null;
}): IDiscountResult => {
  const now = new Date();

  // no discount set
  if (meal.discountPrice === null) {
    return {
      effectivePrice: meal.basePrice,
      discountPrice: null,
      discountPercentage: null,
      isDiscountActive: false,
      discountStartDate: null,
      discountEndDate: null,
    };
  }

  // check if discount is within valid date range
  let isDiscountActive = true;

  if (meal.discountStartDate !== null && meal.discountEndDate !== null) {
    isDiscountActive =
      now >= meal.discountStartDate && now <= meal.discountEndDate;
  }

  // discount exists but is outside its valid window
  if (!isDiscountActive) {
    return {
      effectivePrice: meal.basePrice,
      discountPrice: meal.discountPrice,
      discountPercentage: null,
      isDiscountActive: false,
      discountStartDate: meal.discountStartDate,
      discountEndDate: meal.discountEndDate,
    };
  }

  // discount is active — compute percentage
  const discountPercentage = Math.round(
    ((meal.basePrice - meal.discountPrice) / meal.basePrice) * 100
  );

  return {
    effectivePrice: meal.discountPrice,
    discountPrice: meal.discountPrice,
    discountPercentage,
    isDiscountActive: true,
    discountStartDate: meal.discountStartDate,
    discountEndDate: meal.discountEndDate,
  };
};