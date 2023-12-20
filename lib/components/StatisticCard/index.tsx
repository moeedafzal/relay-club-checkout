import { Card, Statistic } from "antd";
import React from "react";

// Props type definition for StatisticCard component.
type Props = {
  title: string;
  value: string | number;
  width?: number;
}

const StatisticCard = ({
  title,
  value,
  width,
}: Props) => (
  // Card component for statistic of each item.
  <Card bordered={false} style={{ width: width || "200px" }}>
    <Statistic title={title} value={value} />
  </Card>
);

export default StatisticCard;