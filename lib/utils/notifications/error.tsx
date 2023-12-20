import { notification } from "antd";

const errorNotification = ({
  key,
  message,
  description,
}: {
  key: string;
  message: string;
  description: string | JSX.Element;
}) => {
  return notification.error({
    key,
    message,
    description,
  });
};

export default errorNotification;