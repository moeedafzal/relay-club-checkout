import { Card, Divider, Modal, Space, Typography } from "antd";
import items from "../../utils/database/items.json";
import { CheckoutData, Cart } from "../../utils/types";
import StatisticCard from "../StatisticCard";
import React from "react";

// Destructuring Title component from Typography.
const { Title } = Typography;

// Props type definition for ReceiptModal component.
type Props = {
  checkoutData: CheckoutData;
  isVisible: boolean;
  onCancel: () => void;
};

// Type definition for a single item in the cart.
type CartItem = Cart[0];

const ItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  // Finding the item by SKU.
  const item = items.find((i) => i.sku === cartItem.sku);
  if (item) {
    return (
      // Card component to render details of each item in the receipt.
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
          cursor: "initial",
        }}
        hoverable
      >
        <Space>
          {/* Displaying the item details. */}
          <StatisticCard title="Name" value={item.name} />
          <StatisticCard title="Price" value={`$${item.price}`} />
          <StatisticCard title="Quantity" value={cartItem.quantity} />
        </Space>
      </Card>
    );
  }
};

const ReceiptModal = ({ checkoutData, isVisible, onCancel }: Props) => {
  // Destructuring data from checkoutData.
  const { totalPrice, freeItems, itemsBought } = checkoutData;

  return (
    // Modal component to show the receipt details.
    <Modal
      data-testid="receipt-modal"
      title={<Title level={3}>Relay Club Receipt</Title>}
      centered
      open={isVisible}
      onCancel={onCancel}
      cancelText="Done"
      bodyStyle={{ paddingTop: "8px" }}
      destroyOnClose={true}
      okButtonProps={{ style: { display: "none" } }}
      width={"fit-content"}
    >
      {/* Section for displaying the items bought. */}
      <Title level={4}>Items Bought</Title>
      {itemsBought.map((cartItem: CartItem) => (
        <ItemCard key={cartItem.sku} cartItem={cartItem} />
      ))}

      {/* Conditional rendering of free items section if there are any free items. */}
      {!!freeItems.length && (
        <div data-testid="receipt-free-items">
          <Divider />
          <Title level={4}>Free Items</Title>
          {freeItems.map((freeItem) => (
            <ItemCard key={freeItem.sku} cartItem={freeItem} />
          ))}
        </div>
      )}
      <Divider />

      {/* Displaying the total payable amount section. */}
      <Title level={4}>Payable Amount</Title>
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
          cursor: "initial",
          textAlign: "end",
        }}
        hoverable
      >
        <Space>
          <StatisticCard title="Total" value={`$${totalPrice}`} />
        </Space>
      </Card>
    </Modal>
  );
};
export default ReceiptModal;
