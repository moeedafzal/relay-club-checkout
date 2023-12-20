import updateItems from "../pages/api/update-items"; // Update the path accordingly
import { NextApiRequest, NextApiResponse } from "next";
import items from "../lib/utils/database/items.json";


const mockRequest = (
  body: {updatedItems: Array<{ sku: string; name: string; price: string | number }>}
): NextApiRequest =>
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

describe("/api/update-items", () => {
  it("returns 400 when updatedItems is empty", async () => {
    const req = mockRequest({ updatedItems: [] });
    const res = mockResponse();

    await updateItems(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing items data" });
  });

  it("returns 400 when updatedItems has a price which is of type string", async () => {
    const req = mockRequest({
      updatedItems: [...items, { sku: "test", name: "Test", price: "test" }],
    });
    const res = mockResponse();

    await updateItems(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid prices found" });
  });
});
