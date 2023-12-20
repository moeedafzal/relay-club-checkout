import { cloneDeep } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import items from "../../lib/utils/database/items.json";
import specials from "../../lib/utils/database/specials.json";
import { Cart } from "../../lib/utils/types";

// Destructuring special promotions from the specials database.
const { freeItem, xForPriceOfY, bulkDiscount } = specials;

// Function to find the item in cart.
const findItemInCart = ({ sku, cart }: { sku: string; cart: Cart }) => {
  const targetItemInCart = cart.find((item) => item.sku === sku);
  return targetItemInCart;
};

// Function to apply the 'Free Item' special.
const applyFreeItemSpecial = ({
  remainingCartToCalculate,
}: {
  remainingCartToCalculate: Cart;
}): Cart => {
  const freeItems: Cart = [];

  // Finding the target item in the cart.
  const targetItemInCart = findItemInCart({
    sku: freeItem.variables.targetSku.value,
    cart: remainingCartToCalculate,
  });

  // If the target item is in the cart and has a quantity, add it to the freeItems array.
  if (targetItemInCart && !!targetItemInCart.quantity) {
    freeItems.push({
      sku: freeItem.variables.freeItemSku.value,
      quantity: targetItemInCart.quantity,
    });
  }

  return freeItems;
};

// Function to apply the 'X for price of Y' special.
const applyXForPriceOfYSpecial = ({
  remainingCartToCalculate,
}: {
  remainingCartToCalculate: Cart;
}) => {
  const itemsToBuy = xForPriceOfY.variables.numberToBuy.value;
  const itemsToPayFor = xForPriceOfY.variables.numberToPayFor.value;

  // Finding the target item in the cart.
  const targetItemInCart = findItemInCart({
    sku: xForPriceOfY.variables.targetSku.value,
    cart: remainingCartToCalculate,
  });

  // If the target item is in the cart and has enough quantity, apply the special.
  if (targetItemInCart && targetItemInCart.quantity >= itemsToBuy) {
    const targetItemQuantity = targetItemInCart.quantity;

    const discountedPriceQuantity =
      Math.floor(targetItemQuantity / itemsToBuy) * itemsToPayFor;
    const regularPriceQuantity = targetItemQuantity % itemsToBuy;

    targetItemInCart.quantity = discountedPriceQuantity + regularPriceQuantity;
  }
};

// Function to apply the 'Bulk Discount' special.
const applyBulkDiscountSpecial = ({
  remainingCartToCalculate,
  totalPrice,
}: {
  remainingCartToCalculate: Cart;
  totalPrice: number;
}) => {

  // Finding the target item in the cart.
  const targetItemInCart = findItemInCart({
    sku: bulkDiscount.variables.targetSku.value,
    cart: remainingCartToCalculate,
  });

  // If the target item is in the cart and has enough quantity, apply the special.
  if (
    targetItemInCart &&
    !!targetItemInCart.quantity &&
    targetItemInCart.quantity >= bulkDiscount.variables.minimumItemCount.value
  ) {
    const discountedPrice = bulkDiscount.variables.discountedPrice.value;

    totalPrice += targetItemInCart.quantity * discountedPrice;

    targetItemInCart.quantity = 0;
  }

  return totalPrice;
};

// Function to calculate the final price after all the specials have been applied.
const calculateFinalPrice = ({
  totalPrice,
  freeItems,
  remainingCartToCalculate,
}: {
  totalPrice: number;
  freeItems: Cart;
  remainingCartToCalculate: Cart;
}) => {
  remainingCartToCalculate.forEach((item) => {
    // Finding the item in the database.
    const itemInDb = items.find((i) => i.sku === item.sku);

    // If the item is not in the database or has no quantity, do not proceed.
    if (!item.quantity || !itemInDb) return;

    // Finding the item in the freeItems array.
    const freeItem = freeItems.find((i) => i.sku === item.sku);

    // If the item is in the freeItems array, do not add its price to the total.
    if (freeItem) {
      if (freeItem.quantity >= item.quantity) {
        item.quantity = 0;
        return;
      }

      item.quantity -= freeItem.quantity;
    }

    // Adding the item's price to the total.
    totalPrice += item.quantity * itemInDb.price;
  });
  return totalPrice;
};

const checkout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let totalPrice = 0;

    // Destructuring the cart from the request body.
    const { cart }: { cart: Cart } = req.body;

    // Creating a clone of the cart to calculate the price.
    const remainingCartToCalculate = cloneDeep(cart);

    // If the cart is empty, return an error.
    if (!remainingCartToCalculate.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // If the cart contains an invalid item, return an error.
    const allItemsSku = items.map((item) => item.sku);
    if (
      remainingCartToCalculate.find((item) => !allItemsSku.includes(item.sku))
    ) {
      return res.status(400).json({ message: "Invalid item in cart" });
    }

    // Applying the specials.
    const freeItems = applyFreeItemSpecial({ remainingCartToCalculate });
    applyXForPriceOfYSpecial({ remainingCartToCalculate });
    totalPrice = applyBulkDiscountSpecial({
      remainingCartToCalculate,
      totalPrice,
    });

    // Calculating the final price.
    totalPrice = calculateFinalPrice({
      totalPrice,
      freeItems,
      remainingCartToCalculate,
    });

    totalPrice = parseFloat(totalPrice.toFixed(2));

    // Returning the price, free items and the items bought and sending a success response.
    res.status(200).json({ totalPrice, freeItems, itemsBought: cart });
  } catch (error) {
    // Returning an error if something goes wrong.
    console.log(error);
    return res.status(500).json({ message: "Error calculating the price" });
  }
};

export default checkout;
