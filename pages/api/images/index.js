import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas } from "canvas";
import { parseForm } from "../../../lib/parse-form";
import {
  handleCloudinaryDelete,
  handleCloudinaryUpload,
  handleGetCloudinaryUploads,
} from "../../../lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const result = await handleGetRequest();

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error", error });
      }
    }

    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(201).json({ message: "Success", result });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

async function handleGetRequest() {
  return handleGetCloudinaryUploads();
}

/**
 *
 * @param {NextApiRequest} req
 */
async function handlePostRequest(req) {
  // Get the form data using the parseForm function
  const data = await parseForm(req);

  // Get the layout data
  const layout = JSON.parse(data.fields["layout"]);

  // The transformation object that will be passed to cloudinary to overlay the different images
  const transformation = [];

  // Loop through the uploaded images, upload each to cloudinary and populate the transformation array
  for (const [key, file] of Object.entries(data.files)) {
    // Upload the image to cloudinary
    const imageUploadResponse = await handleCloudinaryUpload({
      file: file.filepath,
    });

    // Get the image section data
    const section = JSON.parse(data.fields[key]);

    // Create a transformation object and append it to the transformation array. The section data contains the x, y, width and height of the image which we need to overlay the image appropriately
    transformation.push({
      overlay: imageUploadResponse.public_id,
      width: section.width,
      height: section.height,
      x: section.x,
      y: section.y,
      crop: "fill",
      gravity: "north_west",
    });
  }

  // Create a canvas object
  const canvas = createCanvas(layout.width, layout.height);

  // Create a canvas context
  const context = canvas.getContext("2d");

  // Fill the canvas with white
  context.fillStyle = "#ffffff";

  // Fill the canvas
  context.fillRect(0, 0, layout.width, layout.height);

  // Get the canvas image data
  const backgroundImageBuffer = canvas.toBuffer("image/png");

  // Upload the background image to cloudinary
  const backgroundImageUploadResponse = await handleCloudinaryUpload({
    file: `data:image/png;base64,${backgroundImageBuffer.toString("base64")}`,
    inFolder: true,
    transformation,
  });

  // Delete the initially uploaded images from cloudinary
  await handleCloudinaryDelete(transformation.map((t) => t.overlay));

  return backgroundImageUploadResponse;
}
