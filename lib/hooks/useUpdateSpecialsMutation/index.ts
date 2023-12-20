import { useMutation } from "@tanstack/react-query";
import { Specials } from "../../utils/types";
import errorNotification from "../../utils/notifications/error";
import successNotification from "../../utils/notifications/success";

// Custom hook for updating special promotions.
const useUpdateSpecialsMutation = () => {
  const mutation = useMutation({
    mutationKey: ["updateSpecials"], // Unique key for the mutation to manage its state.
    mutationFn: async (updatedSpecials: Specials) => {
      const response = await fetch("/api/update-specials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedSpecials }), // Sending the updated specials data as the request body.
      });

      // Handling responses that are not OK (e.g., network errors, server errors).
      if (!response.ok) {
        // Displaying an error notification.
        errorNotification({
          key: "specials-update-error",
          message: "Error Updating Specials",
          description:
            "Something went wrong while updating specials. Please try again later",
        });
        throw new Error("Error updating specials");
      }
      // Displaying a success notification upon success.
      successNotification({
        key: "specials-update-success",
        message: "Successfully Updated Specials",
        description: "Specials have been successfully updated!",
      });

      // Parsing the response data.
      const responseData = await response.json();
      return responseData;
    },
  });

  return mutation;
};

export default useUpdateSpecialsMutation;
