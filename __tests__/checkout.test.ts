import { NextApiRequest, NextApiResponse } from "next";
import checkout from "../pages/api/checkout";
import { Cart } from "../lib/utils/types";
import {
  noSpecialsAppliedCheckoutData,
  freeItemSpecialAppliedCheckoutData,
  xForPriceOfYSpecialAppliedCheckoutData,
  bulkDiscountSpecialAppliedCheckoutData,
} from "../lib/utils/testData";

const mockRequest = (body: { cart: Cart }): NextApiRequest =>
  ({
    body,
  } as NextApiRequest);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
};

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("/api/checkout", () => {
  it("calculates the correct total price without applying any specials", async () => {
    const req = mockRequest(noSpecialsAppliedCheckoutData.input);
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(noSpecialsAppliedCheckoutData.output);
  });

  it("calculates the correct total price while applying the free item special", async () => {
    const req = mockRequest(freeItemSpecialAppliedCheckoutData.input);
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      freeItemSpecialAppliedCheckoutData.output
    );
  });

  it("calculates the correct total price while applying the X for the price of Y special", async () => {
    const req = mockRequest(xForPriceOfYSpecialAppliedCheckoutData.input);
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      xForPriceOfYSpecialAppliedCheckoutData.output
    );
  });

  it("calculates the correct total price while applying the bulk discount special", async () => {
    const req = mockRequest(bulkDiscountSpecialAppliedCheckoutData.input);
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      bulkDiscountSpecialAppliedCheckoutData.output
    );
  });

  it ("returns 400 if cart is empty", async () => {
    const req = mockRequest({ cart: [] });
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart is empty" });
  });

  it ("returns 400 if cart contains invalid item", async () => {
    const req = mockRequest({ cart: [{ sku: "invalid", quantity: 1 }] });
    const res = mockResponse();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid item in cart" });
  });
});
