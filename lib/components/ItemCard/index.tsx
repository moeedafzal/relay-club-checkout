import { Card, InputNumber, Space, Statistic, Typography } from "antd";
import { Dispatch, SetStateAction } from "react";
import { Cart, Items } from "../../utils/types";
import ItemCardActionButtons from "../ItemCardActionButtons";
import StatisticCard from "../StatisticCard";
import React from "react";

// Props type definition for ItemCard component.
type Props = {
  item: Items[0];
  checkoutProps?: {
    cart: Cart;
    updateCart: Dispatch<SetStateAction<Cart>>;
  };
  adminProps?: {
    updatePrice: ({ sku, newPrice }: { sku: string; newPrice: number }) => void;
  };
};

const { Title } = Typography;

const ItemCard = ({ item, checkoutProps, adminProps }: Props) => {
  const actions = [];

  // If checkoutProps are provided, add action buttons to the card.
  if (checkoutProps) {
    actions.push(
      <ItemCardActionButtons
        sku={item.sku}
        cart={checkoutProps.cart}
        updateCart={checkoutProps.updateCart}
      />
    );
  }

  // Conditional declaration of priceUpdateInput element if adminProps are provided.
  const priceUpdateInput = adminProps ? (
    <InputNumber
      data-testid="admin-number-input"
      size="large"
      style={{ minWidth: 150 }}
      min={1}
      max={1000000}
      defaultValue={item.price}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      onChange={(value: number | null) => {
        if (!value) return;
        return adminProps.updatePrice({
          sku: item.sku,
          newPrice: value,
        });
      }}
    />
  ) : null;

  return (
    // Card component for each item.
    <Card
      data-testid="item-card"
      style={{
        marginBottom: "16px",
        borderRadius: "8px",
        cursor: "initial",
      }}
      hoverable
      title={<Title level={3}>{item.name}</Title>}
      actions={actions}
    >
      {/* Displaying item details using the StatisticCard component. */}
      <Space>
        <StatisticCard title="SKU" value={item.sku} />
        <StatisticCard title="Name" value={item.name} />
        <StatisticCard
          title={adminProps ? "Current Price" : "Price"}
          value={`$${item.price}`}
        />

        {/*  Conditional rendering of priceUpdateInput element if adminProps are provided. */}
        {adminProps && (
          <Card bordered={false} style={{ width: "200px" }}>
            <Statistic title="New Price" formatter={(_) => priceUpdateInput} />
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default ItemCard;
