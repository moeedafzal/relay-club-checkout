import { SendOutlined } from "@ant-design/icons";
import { Button, Divider, Tooltip } from "antd";
import { cloneDeep, isEqual } from "lodash";
import { useState } from "react";
import useUpdateSpecialsMutation from "../../hooks/useUpdateSpecialsMutation";
import specials from "../../utils/database/specials.json";
import { Specials, SpecialsKeys } from "../../utils/types";
import SpecialsCard from "../SpecialsCard";
import React from "react";

const UpdateSpecials = () => {
  // Declaring state for managing the updated specials.
  const [updatedSpecials, setUpdatedSpecials] = useState<Specials>(
    cloneDeep(specials)
  );
  const { mutate: updateSpecials, isPending } = useUpdateSpecialsMutation();

  // Extracting the keys of the specials as an array.
  const specialsKeys = Object.keys(updatedSpecials) as Array<SpecialsKeys>;

  // Function to handle the update of a special.
  const handleUpdateSpecials = ({
    specialKey,
    newValue,
    variableKey,
  }: {
    specialKey: string;
    variableKey: string;
    newValue: string | number;
  }): void => {
    setUpdatedSpecials((prev) => ({
      ...prev,
      [specialKey]: {
        ...prev[specialKey],
        variables: {
          ...prev[specialKey].variables,
          [variableKey]: {
            ...prev[specialKey].variables[variableKey],
            value: newValue,
          },
        },
      },
    }));
    return;
  };

  return (
    <div>
      {/* Mapping over each special and rendering its card. */}
      {specialsKeys.map((specialKey) => (
        <SpecialsCard
          key={specialKey}
          special={specials[specialKey]}
          updateSpecial={({
            variableKey,
            newValue,
          }: {
            variableKey: string;
            newValue: string | number;
          }) => handleUpdateSpecials({ specialKey, variableKey, newValue })}
        />
      ))}
      <Divider />

      {/* Button to update specials; enabled only if changes are made. */}
      <div style={{ textAlign: "end", marginTop: 24 }}>
        <Tooltip
          title={
            isEqual(updatedSpecials, specials) &&
            "You must update at least one special before proceeding"
          }
        >
          <Button
            data-testid="update-specials-button"
            disabled={isEqual(updatedSpecials, specials)}
            type="primary"
            size="large"
            onClick={() => {
              updateSpecials(updatedSpecials);
            }}
            loading={isPending}
          >
            Update Specials <SendOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default UpdateSpecials;
