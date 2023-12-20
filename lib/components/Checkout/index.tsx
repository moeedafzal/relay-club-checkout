import { SendOutlined } from "@ant-design/icons";
import { Button, Divider, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import useCheckout from "../../hooks/useCheckout";
import items from "../../utils/database/items.json";
import errorNotification from "../../utils/notifications/error";
import { Cart } from "../../utils/types";
import ItemCard from "../ItemCard";
import ReceiptModal from "../ReceiptModal";
import ScanSearchItem from "../ScanSearchItem";
import React from "react";

const { Title } = Typography;

const Checkout = () => {
  // Declaring states for managing the shopping cart and receipt modal visibility.
  const [cart, setCart] = useState<Cart>([]);
  const [receiptModalVisible, setReceiptModalVisible] =
    useState<boolean>(false);

  // Custom hook to handle checkout process, loading state, and errors.
  const {
    data: checkoutData,
    refetch: checkout,
    isLoading,
    error,
  } = useCheckout({ cart });

  // Function to handle the checkout action.
  const handleCheckout = async () => {
    const res = await checkout();
    if (!!res.data) {
      setReceiptModalVisible(true);
      setCart([]);
    }
  };

  // Effect hook to show error notification if checkout fails.
  useEffect(() => {
    if (!isLoading && !!error) {
      errorNotification({
        key: "checkout-error",
        message: "Error Checking Out",
        description:
          "Something went wrong while checking out. Please try again later",
      });
    }
  }, [error]);

  return (
    <div>
      <Title data-testid="checkout-title">Checkout</Title>

      {/* Component for searching items to add to the cart. */}
      <ScanSearchItem cart={cart} updateCart={setCart} />
      <Divider />
      <Title level={2}>Select Item</Title>

      {/* Component for rendering a card for each product with its specifications and action buttons. */}
      {items.map((item) => (
        <ItemCard
          key={item.sku}
          item={item}
          checkoutProps={{ cart: cart, updateCart: setCart }}
        />
      ))}
      <Divider />

      {/* Receipt Modal; Renders a receipt in a modal upon checkout. */}
      {!!checkoutData && (
        <ReceiptModal
          checkoutData={checkoutData}
          isVisible={receiptModalVisible}
          onCancel={() => {
            setReceiptModalVisible(false);
          }}
        />
      )}

      {/* Checkout button to handle checking out; disabled when the cart is empty. */}
      <div style={{ textAlign: "end", marginTop: 24 }}>
        <Tooltip
          title={
            !cart.length &&
            "You must add items to your cart before checking out"
          }
        >
          <Button
            data-testid="checkout-button"
            disabled={!cart.length || !cart.find((i) => i.quantity)}
            type="primary"
            size="large"
            loading={isLoading}
            onClick={handleCheckout}
          >
            Checkout <SendOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Checkout;
