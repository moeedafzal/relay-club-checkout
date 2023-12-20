import { Cart, CheckoutData } from "../types";

export const noFreeItemData: CheckoutData = {
  itemsBought: [{ sku: "ipd", quantity: 1 }],
  totalPrice: 549.99,
  freeItems: [],
};

export const noSpecialsAppliedCheckoutData: {
  input: { cart: Cart };
  output: CheckoutData;
} = {
  input: {
    cart: [
      { sku: "ipd", quantity: 2 },
      { sku: "atv", quantity: 2 },
      { sku: "vga", quantity: 1 },
    ],
  },
  output: {
    totalPrice: 1348.98,
    freeItems: [],
    itemsBought: [
      { sku: "ipd", quantity: 2 },
      { sku: "atv", quantity: 2 },
      { sku: "vga", quantity: 1 },
    ],
  },
};

export const freeItemSpecialAppliedCheckoutData: {
  input: { cart: Cart };
  output: CheckoutData;
} = {
  input: {
    cart: [
      { sku: "mbp", quantity: 2 },
      { sku: "vga", quantity: 1 },
    ],
  },
  output: {
    totalPrice: 2799.98,
    freeItems: [{ sku: "vga", quantity: 2 }],
    itemsBought: [
      { sku: "mbp", quantity: 2 },
      { sku: "vga", quantity: 1 },
    ],
  },
};

export const xForPriceOfYSpecialAppliedCheckoutData: {
  input: { cart: Cart };
  output: CheckoutData;
} = {
  input: {
    cart: [
      { sku: "atv", quantity: 8 },
      { sku: "vga", quantity: 1 },
      { sku: "ipd", quantity: 1 },
    ],
  },
  output: {
    totalPrice: 1236.99,
    freeItems: [],
    itemsBought: [
      { sku: "atv", quantity: 8 },
      { sku: "vga", quantity: 1 },
      { sku: "ipd", quantity: 1 },
    ],
  },
};

export const bulkDiscountSpecialAppliedCheckoutData: {
  input: { cart: Cart };
  output: CheckoutData;
} = {
  input: {
    cart: [
      { sku: "ipd", quantity: 6 },
      { sku: "atv", quantity: 1 },
    ],
  },
  output: {
    totalPrice: 3109.44,
    freeItems: [],
    itemsBought: [
      { sku: "ipd", quantity: 6 },
      { sku: "atv", quantity: 1 },
    ],
  },
};
