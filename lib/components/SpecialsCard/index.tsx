import { Card, InputNumber, Select, Space, Statistic, Typography } from "antd";
import { includes } from "lodash";
import items from "../../utils/database/items.json";
import { Special, SpecialsVariablesEnum } from "../../utils/types";
import React from "react";

// Type definition for the function to update a special.
type UpdateSpecial = ({
  variableKey,
  newValue,
}: {
  variableKey: string;
  newValue: string | number;
}) => void;

// Props type definition for SpecialsCard component.
type Props = {
  special: Special;
  updateSpecial: UpdateSpecial;
};

// Destructuring Title component from Typography.
const { Title } = Typography;

const VariablesInput = ({
  variableValue,
  variableKey,
  updateSpecial,
}: {
  variableValue: string | number;
  variableKey: string;
  updateSpecial: UpdateSpecial;
}) => {

  // Determining if the input should be a SKU selector.
  const skuInputRequired = includes(
    [SpecialsVariablesEnum.FreeItemSku, SpecialsVariablesEnum.TargetSku],
    variableKey
  );

  // Checking if the value is a price; to render properly with a $ sign.
  const isPricingValue = includes(
    [SpecialsVariablesEnum.DiscountedPrice],
    variableKey
  );

  // Rendering a Select component for SKU inputs.
  if (skuInputRequired) {
    return (
      <Select
        style={{ width: 250 }}
        showSearch
        allowClear
        size="large"
        defaultValue={variableValue}
        placeholder="Search for an item by SKU or Name"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.label
            ? option.label.toLowerCase().includes(input.toLowerCase())
            : false
        }
        options={items.map((item) => ({
          value: item.sku,
          label: `${item.sku} - ${item.name}`,
        }))}
        onSelect={(newValue: string | number) => {
          updateSpecial({ variableKey, newValue });
        }}
      />
    );
  }

  // Rendering an InputNumber component for non-SKU inputs.
  return (
    <InputNumber
      size="large"
      style={{ width: 250 }}
      min={1}
      max={1000000}
      defaultValue={variableValue as number}
      formatter={(value) =>
        isPricingValue
          ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : `${value}`
      }
      onChange={(newValue: number | null) => {
        if (!newValue) return;
        updateSpecial({ variableKey, newValue });
      }}
    />
  );
};

const SpecialsCard = ({ special, updateSpecial }: Props) => {
  // Destructuring the name and variables of the special.
  const { name, variables } = special;
  const variablesKeys = Object.keys(variables);

  return (
    // Card component for each special.
    <Card
      data-testid="specials-card"
      style={{
        marginBottom: "16px",
        borderRadius: "8px",
        cursor: "initial",
      }}
      hoverable
      title={<Title level={3}>{name}</Title>}
    >
      <Space>
        {/* Mapping over each variable to render its input field. */}
        {variablesKeys.map((variableKey) => {
          const variable = variables[variableKey];
          const { description, value } = variable;
          return (
            <Space key={variableKey}>
              <Card bordered={false} style={{ width: 320 }}>
                <Statistic
                  title={description}
                  value={value}
                  formatter={(_) => (
                    <VariablesInput
                      variableValue={value}
                      variableKey={variableKey}
                      updateSpecial={updateSpecial}
                    />
                  )}
                />
              </Card>
            </Space>
          );
        })}
      </Space>
    </Card>
  );
};

export default SpecialsCard;
