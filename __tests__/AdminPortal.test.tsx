import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminPortal from "../lib/components/AdminPortal";
import UpdatePricing from "../lib/components/UpdatePricing";
import UpdateSpecials from "../lib/components/UpdateSpecials";
import TestingWrapper from "../lib/components/TestingWrapper";
import items from "../lib/utils/database/items.json";
import specials from "../lib/utils/database/specials.json";
import React from "react";

const itemsCount = items.length;
const specialsCount = Object.keys(specials).length;

describe("AdminPortal and Children Component", () => {
  it("checks if the admin portal renders properly", () => {
    render(<AdminPortal />, { wrapper: TestingWrapper });

    const adminPortalTitle = screen.getByTestId("admin-portal-title");
    const updatePricingTab = screen.getAllByText("Update Pricing")[0];
    const updateSpecialsTab = screen.getAllByText("Update Specials")[0];

    expect(adminPortalTitle).toBeInTheDocument();
    expect(updatePricingTab).toBeInTheDocument();
    expect(updateSpecialsTab).toBeInTheDocument();
  });
});

describe("UpdatePricing Component", () => {
  it("checks if UpdatePricing renders all the items", () => {
    render(<UpdatePricing />, { wrapper: TestingWrapper });

    const itemCards = screen.getAllByTestId("item-card");

    expect(itemCards.length).toEqual(itemsCount);
  });

  describe("UpdateSpecials Component", () => {
    it("checks if UpdateSpecials renders all the specials", () => {
      render(<UpdateSpecials />, { wrapper: TestingWrapper });

      const specialCards = screen.getAllByTestId("specials-card");

      expect(specialCards.length).toEqual(specialsCount);
    });
  });

  it("updates price of the first item by $10 and checks if the update-pricing-button is enabled which was initially disabled", async () => {
    render(<UpdatePricing />, { wrapper: TestingWrapper });

    const updatePricingButton = screen.getByTestId("update-pricing-button");

    expect(updatePricingButton).toBeInTheDocument();
    expect(updatePricingButton).toBeDisabled();

    const inputNumberElement = screen.getAllByTestId(
      "admin-number-input"
    )[0] as HTMLInputElement;

    const newValue = inputNumberElement.value + 10;

    await waitFor(() =>
      fireEvent.change(inputNumberElement, { target: { value: newValue } })
    );

    const updatedUpdatePricingButton = screen.getByTestId(
      "update-pricing-button"
    );
    expect(updatedUpdatePricingButton).toBeEnabled();
  });
});
