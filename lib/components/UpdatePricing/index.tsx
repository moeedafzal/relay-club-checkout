import { SendOutlined } from "@ant-design/icons";
import { Button, Divider, Tooltip } from "antd";
import { clone, cloneDeep, isEqual } from "lodash";
import { useState } from "react";
import useUpdateItemsMutation from "../../hooks/useUpdateItemsMutation";
import items from "../../utils/database/items.json";
import ItemCard from "../ItemCard";
import React from "react";

const UpdatePricing = () => {
  // Declaring state for managing the updated items.
  const [updatedItems, setUpdatedItems] = useState(cloneDeep(items));
  const { mutate: updatePrice, isPending } = useUpdateItemsMutation();

  // Function to handle the price change of an item.
  const handlePriceChange = ({
    sku,
    newPrice,
  }: {
    sku: string;
    newPrice: number;
  }) => {
    const updatedItemsCopy = clone(updatedItems);
    const updatedItem = updatedItemsCopy.find((i) => i.sku === sku);
    if (updatedItem) {
      updatedItem.price = newPrice;
      setUpdatedItems(updatedItemsCopy);
    }
    return;
  };

  return (
    <div>
      {/* Mapping over each item and rendering its item card. */}
      {items.map((item) => (
        <ItemCard
          key={item.sku}
          item={item}
          adminProps={{ updatePrice: handlePriceChange }}
        />
      ))}
      <Divider />

      {/* Button to update prices; enabled only if changes are made. */}
      <div style={{ textAlign: "end", marginTop: 24 }}>
        <Tooltip
          title={
            isEqual(updatedItems, items) &&
            "You must update the price of at least one item before proceeding"
          }
        >
          <Button
            data-testid="update-pricing-button"
            disabled={isEqual(updatedItems, items)}
            type="primary"
            size="large"
            onClick={() => {
              updatePrice(updatedItems);
            }}
            loading={isPending}
          >
            Update Pricing <SendOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default UpdatePricing;
