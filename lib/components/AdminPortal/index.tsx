import { Typography, Tabs } from "antd";
import UpdatePricing from "../UpdatePricing";
import UpdateSpecials from "../UpdateSpecials";
import React from "react";

const { Title } = Typography;

const AdminPortal = () => {
  return (
    <>
      <Title data-testid="admin-portal-title">Admin Portal</Title>
      {/* Tabs component to switch between updating pricing or specials. */}
      <Tabs
        size="large"
        defaultActiveKey="update-pricing" // Default tab to be displayed set to 'Update Pricing'.
        items={[
          {
            key: "update-pricing",
            label: "Update Pricing",
            children: <UpdatePricing />,
          },
          {
            key: "update-specials",
            label: "Update Specials",
            children: <UpdateSpecials />,
          },
        ]}
      />
    </>
  );
};

export default AdminPortal;