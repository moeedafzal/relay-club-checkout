import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Checkout from "../lib/components/Checkout";
import ReceiptModal from "../lib/components/ReceiptModal";
import useCheckout from "../lib/hooks/useCheckout";
import TestingWrapper from "../lib/components/TestingWrapper";
import items from "../lib/utils/database/items.json";
import { noFreeItemData } from "../lib/utils/testData";

const itemsCount = items.length;

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

const mockedCheckoutQuery = useCheckout as jest.Mock;
jest.mock("../lib/hooks/useCheckout");

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Checkout Component", () => {
  mockedCheckoutQuery.mockImplementation(() => ({}));
  it("renders Checkout component adn checks for page title", () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    const checkoutTitle = screen.getByTestId("checkout-title");

    expect(checkoutTitle).toBeInTheDocument();
  });

  it("checks if all items are rendered", () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    const itemCards = screen.getAllByTestId("item-card");

    expect(itemCards.length).toEqual(itemsCount);
  });

  it("checks if checkout and select-add-to-cart-button buttons are initially disabled", () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    const checkoutButton = screen.getByTestId("checkout-button");
    const selectAddToCartButton = screen.getByTestId(
      "select-add-to-cart-button"
    );

    expect(checkoutButton).toBeDisabled();
    expect(selectAddToCartButton).toBeDisabled();
  });

  it("checks add-to-cart and remove-from-cart buttons and if they are rendered properly", async () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    const addToCartButtons = screen.getAllByTestId("add-to-cart-button");
    const removeFromCartButtons = screen.queryAllByTestId(
      "remove-from-cart-button"
    );

    expect(addToCartButtons.length).toBe(4);
    expect(removeFromCartButtons.length).toBe(0);

    await waitFor(() => addToCartButtons[0].click());

    const updatedAddToCartButtons = screen.getAllByTestId("add-to-cart-button");
    const updatedRemoveFromCartButtons = screen.getAllByTestId(
      "remove-from-cart-button"
    );

    expect(updatedRemoveFromCartButtons.length).toBe(1);
    expect(updatedAddToCartButtons.length).toBe(3);
  });

  it("adds item to cart and checks if checkout button is enabled", async () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    const addToCartButtons = screen.getAllByTestId("add-to-cart-button");
    const checkoutButton = screen.getByTestId("checkout-button");

    expect(checkoutButton).toBeDisabled();

    await waitFor(() => addToCartButtons[0].click());

    const updatedCheckoutButton = screen.getByTestId("checkout-button");

    expect(updatedCheckoutButton).toBeEnabled();
  });

  it("checks if useCheckout returns error, receipt should not show up and error is thrown", async () => {
    render(<Checkout />, { wrapper: TestingWrapper });

    mockedCheckoutQuery.mockImplementation(() => ({
      error: "Error",
    }));

    const addToCartButtons = screen.getAllByTestId("add-to-cart-button");
    const checkoutButton = screen.getByTestId("checkout-button");

    await waitFor(() => addToCartButtons[0].click());
    await waitFor(() => checkoutButton.click());

    const receiptModal = screen.queryByTestId("receipt-modal");
    const errorNotification = screen.getByText("Error Checking Out");

    expect(errorNotification).toBeInTheDocument();
    expect(receiptModal).not.toBeInTheDocument();
  });

  it("checks if useCheckout data has no free items, receipt should not have free items section", async () => {
    render(
      <ReceiptModal
        isVisible={true}
        onCancel={() => {}}
        checkoutData={noFreeItemData}
      />
    );

    const receiptModal = screen.queryByTestId("receipt-modal");
    const freeItemsSection = screen.queryByTestId("receipt-free-items");

    expect(receiptModal).toBeInTheDocument();
    expect(freeItemsSection).not.toBeInTheDocument();
  });
});
