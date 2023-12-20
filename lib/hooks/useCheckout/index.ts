import { useQuery } from "@tanstack/react-query";
import { Cart, CheckoutData } from "../../utils/types";

// Custom hook for performing the checkout process.
const useCheckout = ({ cart }: { cart: Cart }) => {
  const query = useQuery({
    queryKey: ["checkout"], // Unique key for the query to cache and manage the data.
    queryFn: async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }), // Sending the cart data as the request body.
      });

      // Handling responses that are not OK (e.g., network errors, server errors).
      if (!response.ok) {
        throw new Error("Error checking out");
      }

      // Parsing the response data into the CheckoutData type.
      const responseData: CheckoutData = await response.json();
      return responseData;
    },
    enabled: false, // Disables automatic running of this query on component mount.
  });

  return query;
};

export default useCheckout;
