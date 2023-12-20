import { notification } from "antd";

const successNotification = ({
  key,
  message,
  description,
}: {
  key: string;
  message: string;
  description: string | JSX.Element;
}) =>
  notification.success({
    key,
    message,
    description,
  });

  export default successNotification;