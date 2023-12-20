import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import { Dispatch, SetStateAction } from "react";
import { Cart } from "../../utils/types";
import React from "react";

// Props type definition for ItemCardActionButtons component.
type Props = {
  sku: string;
  cart: Cart;
  updateCart: Dispatch<SetStateAction<Cart>>;
};

const ItemCardActionButtons = ({ sku, cart, updateCart }: Props) => {
  // Finding the item in the cart based on SKU and getting its quantity.
  const itemInCart = cart.find((cartItem) => cartItem.sku === sku);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  // Function to update the quantity of the item in the cart.
  const updateQuantity = (value: number | null) => {
    if (value === null) {
      return;
    }
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.sku === sku) {
        return { ...cartItem, quantity: value };
      }
      return cartItem;
    });
    updateCart(updatedCart);
  };

  // Button component for adding the item to the cart.
  const AddToCartButton = () => {
    return (
      <Button
        data-testid="add-to-cart-button"
        type="primary"
        size="middle"
        onClick={() => {
          updateCart([...cart, { sku: sku, quantity: 1 }]);
        }}
        icon={<PlusCircleOutlined />}
      >
        Add to cart
      </Button>
    );
  };

  // Button component for removing the item from the cart.
  const RemoveFromCartButton = () => {
    return (
      <Button
        data-testid="remove-from-cart-button"
        type="primary"
        danger
        size="middle"
        onClick={() => {
          const updatedCart = cart.filter((cartItem) => cartItem.sku !== sku);
          updateCart(updatedCart);
        }}
        icon={<MinusCircleOutlined />}
      >
        Remove from cart
      </Button>
    );
  };

  return (
    // Rendering add or remove buttons and InputNumber element depending on the item's presence in the cart.
    <div style={{ textAlign: "right", paddingRight: 24 }}>
      {itemInCart ? (
        <>
          {/* Input for changing item quantity in the cart. */}
          <InputNumber
            size="middle"
            value={quantityInCart}
            onChange={updateQuantity}
            autoFocus
            min={1}
            style={{ marginRight: 8 }}
          />
          <RemoveFromCartButton />
        </>
      ) : (
        <AddToCartButton />
      )}
    </div>
  );
};

export default ItemCardActionButtons;
