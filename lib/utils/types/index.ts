import items from "../database/items.json";

export type Items = typeof items;
export type Cart = Array<{ sku: string; quantity: number }>;

export type CheckoutData = {totalPrice: number; freeItems: Cart, itemsBought: Cart}

export type SpecialsKeys = "bulkDiscount" | "freeItem" | "xForPriceOfY";

export type SpecialsVariable = { description: string; value: string | number };

export type SpecialsVariables = Record<string, SpecialsVariable>;

export type Special = {
  name: string;
  variables: SpecialsVariables;
};

export type Specials = {
  [key in SpecialsKeys[number]]: Special;
};

export enum SpecialsVariablesEnum {
  TargetSku = "targetSku",
  NumberToBuy = "numberToBuy",
  NumberToPayFor = "numberToPayFor",
  MinimumItemCount = "minimumItemCount",
  DiscountedPrice = "discountedPrice",
  FreeItemSku = "freeItemSku",
}
