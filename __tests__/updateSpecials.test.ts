import updatedSpecials from "../pages/api/update-specials";
import { NextApiRequest, NextApiResponse } from "next";
import specials from "../lib/utils/database/specials.json";
import { Specials } from "../lib/utils/types";

const mockRequest = (body: { updatedSpecials: Specials }): NextApiRequest =>
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

describe("/api/update-specials", () => {
  it("returns 400 when updatedSpecials is an empty object", async () => {
    const req = mockRequest({ updatedSpecials: {} });
    const res = mockResponse();

    await updatedSpecials(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing specials data" });
  });

  it("returns 400 when some updated specials have empty variables", async () => {
    const req = mockRequest({
      updatedSpecials: {
        ...specials,
        testSpecial: {
          name: "Test Special",
          variables: {},
        },
      },
    });
    const res = mockResponse();

    await updatedSpecials(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Empty variables found" });
  });
});
