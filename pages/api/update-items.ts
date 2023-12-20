import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Items } from "../../lib/utils/types";

const updateItems = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Destructuring the updatedItems from the request body.
    const { updatedItems }: { updatedItems: Items } = req.body;

    // If the updatedItems is empty, return an error.
    if (!updatedItems.length) {
      return res.status(400).json({ message: "Missing items data" });
    }

    // If any updated item has an invalid price, return an error.
    const prices = updatedItems.map((item) => item.price);
    if (prices.some((price) => typeof price !== "number")) {
      return res.status(400).json({ message: "Invalid prices found" });
    }

    // Defining the file path for the items JSON file.
    const filePath = path.join(process.cwd(), "/lib/utils/database/items.json");

    // Writing the updated items data to the file.
    fs.writeFile(filePath, JSON.stringify(updatedItems), (err) => {
      if (err) {
        throw new Error("Error updating items");
      }

      // Sending a success response.
      res.status(200).json({ message: "Items updated successfully" });
    });
  } catch (error) {
    // Returning an error if something goes wrong.
    console.log(error);
    return res.status(500).json({ message: "Error updating items" });
  }
};

export default updateItems;
