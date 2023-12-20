import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Select, Tooltip, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import items from "../../utils/database/items.json";
import { Cart } from "../../utils/types";
import React from "react";

// Props type definition for ScanSearchItem component.
type Props = {
  cart: Cart;
  updateCart: Dispatch<SetStateAction<Cart>>;
};

// Destructuring Title component from Typography.
const { Title } = Typography;

const ScanSearchItem = ({ cart, updateCart }: Props) => {
  // Declare state for managing the selected item's SKU.
  const [selectedItemSKU, setSelectedItemSKU] = useState<string | null>(null);

  // Function to add the selected item to the cart.
  const addToCart = () => {
    if (selectedItemSKU === null) {
      return;
    }
    const itemInCart = cart.find(
      (cartItem) => cartItem.sku === selectedItemSKU
    );
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    if (quantityInCart === 0) {
      // Adding the item to the cart if it's not already present.
      updateCart([...cart, { sku: selectedItemSKU, quantity: 1 }]);
    } else {
      // Updating the quantity of the item if it's already in the cart.
      const updatedCart = cart.map((cartItem) => {
        if (cartItem.sku === selectedItemSKU) {
          return { ...cartItem, quantity: quantityInCart + 1 };
        }
        return cartItem;
      });
      updateCart(updatedCart);
    }
    // Resetting the selected item SKU after adding to the cart.
    setSelectedItemSKU(null);
  };

  return (
    <>
      <Title level={2}>Scan / Search Item</Title>
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {/* Select component for searching and selecting items. */}
        <Select
          style={{ width: "100%" }}
          showSearch
          allowClear
          placeholder="Search for an item by SKU or Name"
          filterOption={(input, option) =>
            option?.label
              ? option.label.toLowerCase().includes(input.toLowerCase())
              : false
          }
          size="large"
          options={items.map((item) => ({
            value: item.sku,
            label: `${item.sku} - ${item.name}`,
          }))}
          onSelect={(value) => value && setSelectedItemSKU(value)}
        />

        {/* Button to add the selected item to the cart; disabled when no item is selected. */}
        <Tooltip
          title={
            !selectedItemSKU && "You must select an item before adding to cart"
          }
        >
          <Button
            data-testid="select-add-to-cart-button"
            size="large"
            type="primary"
            icon={<PlusCircleOutlined />}
            disabled={!selectedItemSKU}
            onClick={addToCart}
          >
            Add to Cart
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default ScanSearchItem;
