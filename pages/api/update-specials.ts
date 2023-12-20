import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Specials } from "../../lib/utils/types";

const updateSpecials = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Destructuring the updatedSpecials from the request body.
    const { updatedSpecials }: { updatedSpecials: Specials } = req.body;

    // If the updatedSpecials is empty, return an error.
    if (!Object.keys(updatedSpecials).length) {
      return res.status(400).json({ message: "Missing specials data" });
    }

    // If any updated specials has no variables, return an error.
    const emptyVariablesFound = Object.values(updatedSpecials).some(
      (special) => {
        const variables = Object.values(special.variables);
        return !variables.length;
      }
    );
    if (emptyVariablesFound) {
      return res.status(400).json({ message: "Empty variables found" });
    }

    // Defining the file path for the specials JSON file.
    const filePath = path.join(
      process.cwd(),
      "/lib/utils/database/specials.json"
    );

    // Writing the updated specials data to the file.
    fs.writeFile(filePath, JSON.stringify(updatedSpecials), (err) => {
      if (err) {
        throw new Error("Error updating specials");
      }

      // Sending a success response.
      res.status(200).json({ message: "Specials updated successfully" });
    });
  } catch (error) {
    // Returning an error if something goes wrong.
    console.log(error);
    return res.status(500).json({ message: "Error updating specials" });
  }
};

export default updateSpecials;
