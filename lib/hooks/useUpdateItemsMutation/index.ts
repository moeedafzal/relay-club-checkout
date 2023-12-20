import { useMutation } from "@tanstack/react-query";
import { Items } from "../../utils/types";
import errorNotification from "../../utils/notifications/error";
import successNotification from "../../utils/notifications/success";

// Custom hook updating items.
const useUpdateItemsMutation = () => {
  const mutation = useMutation({
    mutationKey: ["updateItems"], // Unique key for the mutation to manage the mutation state.
    mutationFn: async (updatedItems: Items) => {
      const response = await fetch("/api/update-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedItems }), // Sending the updated items data as the request body.
      });

      // Handling responses that are not OK (e.g., network errors, server errors).
      if (!response.ok) {
        // Displaying an error notification.
        errorNotification({
          key: "prices-update-error",
          message: "Error Updating Prices",
          description:
            "Something went wrong while updating prices. Please try again later",
        });
        throw new Error("Error updating prices");
      }
      // Displaying a success notification upon success.
      successNotification({
        key: "prices-update-success",
        message: "Successfully Updated Prices",
        description: "Prices have been successfully updated!",
      });

      // Parsing the response data.
      const responseData = await response.json();
      return responseData;
    },
  });

  return mutation;
};

export default useUpdateItemsMutation;
