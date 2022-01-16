# Photo collage using Cloudinary image transformations and Next.js

## Introduction

You have probably used those collage making apps, either as a native app on your phone or a web app. In this short tutorial, we'll be looking to achieve the same using some cleverly designed layouts, [cloudinary](https://cloudinary.com/?ap=em) and [next.js](https://nextjs.org/). We're going to be using [Cloudinary transformations](https://cloudinary.com/documentation/transformation_reference?ap=em) to overlay the images so they match our layout.

## Prerequisites and setup

You need to have a [Cloudinary](https://cloudinary.com/?ap=em) account. If you do not have one you can register for free [here](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/iqhpl5ojl9p7py5zwmkj?t=default).

You will also need to have Node.js and NPM or Yarn installed on your development environment. Working knowledge of Javascript and React is required. Knowledge of Node.js and Next.js is a plus but not required.

### Creating a new project

You can easily create a Next.js project by running the following command in your terminal:

```bash
npx create-next-app@latest photo-collage-with-cloudinary
```

The command scaffolds a new projects with the name `photo-collage-with-cloudinary`. You can use any appropriate name. For more information on getting started with Next.js and additional options, check out the [docs](https://nextjs.org/docs/getting-started#setup). Change directory to your newly created folder

```bash
cd photo-collage-with-cloudinary
```

You can proceed to open the folder in your favorite code editor.

### Getting cloudinary API credentials

Assuming you already have a cloudinary account at this point, head over to the [cloudinary console page](https://cloudinary.com/console?ap=em). On this page, you'll find your **cloud name**, **api key** and **api secret**.

Create a new file named `.env.local` at the root of your project(`photo-collage-with-cloudinary` folder). Paste the following inside `.env.local`

```env
CLOUD_NAME=YOUR_CLOUD_NAME
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_API_SECRET
```

Make sure to replace `YOUR_CLOUD_NAME`, `YOUR_API_KEY` and `YOUR_API_SECRET` with the **cloud name**, **api key** and **api secret** values that you got from the [cloudinary console page](https://cloudinary.com/console?ap=em).

We've just defined a few [environment variable](https://en.wikipedia.org/wiki/Environment_variable)s. Environment variables allow us to keep sensitive keys away from our publicly accessible code. Read about [environment variables in node.js](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs). Next.js has built in support for environment variables. Find out more in the [next.js environment variables docs](https://nextjs.org/docs/basic-features/environment-variables).

### Installing libraries and dependencies

These are the dependencies we need to install

- [cloudinary](https://www.npmjs.com/package/cloudinary) -This is the cloudinary node SDK. It will make API calls easier.
- [formidable](https://www.npmjs.com/package/formidable) - This is a node.js module for parsing form data. It allows for us to handle file uploads
- [canvas](https://www.npmjs.com/package/canvas) - This is a canvas implementation for the server(node.js)

Run the following command to install them

```bash
npm install cloudinary formidable canvas
```

## Getting started.

Let's start by creating some layouts that we can use to create our collages. Create a new folder called `lib` at the root of your project. Create a new file called `collageLayouts.js` inside this folder. Paste the following inside `lib/collageLayouts.js`.

```js
/**
 * @typedef {Object} CollageLayout
 * @property {number} id
 * @property {number} width
 * @property {number} height
 * @property {() => CollageLayout[]} sections
 */

/**
 * @typedef {Object} CollageSection
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 */

/**
 * Pre-defined layouts. You can add more layouts here. Make sure each has a unique id.
 *
 * @type {CollageLayout[]}
 */
export const layouts = [
  {
    id: 1,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height * 0.4,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height,
          x: this.width * 0.5,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.6,
          x: 0,
          y: this.height * 0.4,
        },
      ];
    },
  },
  {
    id: 2,
    width: 800,
    height: 400,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height,
          x: this.width * 0.5,
          y: 0,
        },
      ];
    },
  },
  {
    id: 3,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: this.width * 0.5,
          y: 0,
        },
        {
          width: this.width,
          height: this.height * 0.5,
          x: 0,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 4,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width,
          height: this.height * 0.5,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: 0,
          y: this.height * 0.5,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: this.width * 0.5,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 5,
    width: 800,
    height: 600,
    sections: function () {
      return [
        {
          width: this.width * 0.4,
          height: this.height,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.6,
          height: this.height * 0.5,
          x: this.width * 0.4,
          y: 0,
        },
        {
          width: this.width * 0.6,
          height: this.height * 0.5,
          x: this.width * 0.4,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 6,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: 0,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.25,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.5,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.75,
        },
      ];
    },
  },
];
```

At the top we have some [jsdoc typedefs](https://jsdoc.app/tags-typedef.html). This is just a neat [jsdoc](https://jsdoc.app/index.html) feature that let's us define custom types without the need for [typescript](https://www.typescriptlang.org/). 

We export an array called layouts. The array contains a bunch of objects. These objects are our layouts. Let's first understand why we need this data. Every layout is a container of a certain width and height. It also contains a unique id. Each container is divided into smaller containers that we can call sections. The sections are what make up the collage layout. We need to know the width and height of each section and also where to place the section relative to the parent container. We can play with the `width`,`height`,`x`, and `y` values to create different layouts. 

---

Create a new file under `lib` folder and name it `parse-form.js`. Paste the following inside `lib/parse-form.js`.

```js
import { IncomingForm, Files, Fields } from "formidable";

/**
 * Parses the incoming form data.
 *
 * @param {NextApiRequest} req The incoming request object
 * @returns {Promise<{fields:Fields;files:Files;}>} The parsed form data
 */
export const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
```

The code inside this file is responsible for parsing incoming form data using the formidable package that we installed earlier. Nothing much out of the ordinary here. A quick glance at the [formidable docs](https://github.com/node-formidable/formidable#api) is enough.

---

Create a file called `cloudinary.js` under `lib` folder. Paste the following inside `lib/cloudinary.js`

```js
// Import the v2 api and rename it to cloudinary
import { v2 as cloudinary, TransformationOptions } from "cloudinary";

// Initialize the sdk with cloud_name, api_key and api_secret
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const CLOUDINARY_FOLDER_NAME = "photo-collage/";

/**
 * Get cloudinary uploads
 * @param {string} folder Folder name
 * @returns {Promise}
 */
export const handleGetCloudinaryUploads = (folder = CLOUDINARY_FOLDER_NAME) => {
  return cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    resource_type: "image",
  });
};

/**
 * @typedef {Object} Resource
 * @property {string | Buffer} file
 * @property {string} publicId
 * @property {boolean} inFolder
 * @property {string} folder
 * @property {TransformationOptions} transformation
 *
 */

/**
 * Uploads an image to cloudinary and returns the upload result
 *
 * @param {Resource} resource
 */
export const handleCloudinaryUpload = ({
  file,
  publicId,
  transformation,
  folder = CLOUDINARY_FOLDER_NAME,
  inFolder = false,
}) => {
  return cloudinary.uploader.upload(file, {
    // Folder to store image in
    folder: inFolder ? folder : null,
    // Public id of image.
    public_id: publicId,
    // Type of resource
    resource_type: "auto",
    // Transformation to apply to the video
    transformation,
  });
};

/**
 * Deletes resources from cloudinary. Takes in an array of public ids
 * @param {string[]} ids
 */
export const handleCloudinaryDelete = (ids) => {
  return cloudinary.api.delete_resources(ids, {
    resource_type: "image",
  });
};
```

The code inside this folder is responsible for communication with cloudinary via the SDK we installed earlier. At the top of the file, we import the `v2` API from cloudinary and rename it to `cloudinary`. You can leave it as `v2`, we just did this for readability. We then call the `.config` method on the API to initialize it and authenticate our application. We pass to it the `cloud_name`, `api_key` and `api_secret`. Remember we defined these as environment variable earlier. `CLOUDINARY_FOLDER_NAME` defines the folder where we want to store our collage images.

The `handleGetCloudinaryUploads` function calls the `api.resources` method on the api. This fetches all resources that have been uploaded to a specific folder. Read about this in the [admin api docs](https://cloudinary.com/documentation/admin_api#get_resources).

`handleCloudinaryUpload` calls the `uploader.upload` method. This uploads a file to cloudinary. It takes in an object that contains the file we want to upload, an optional publicId, transformation object, whether or not to place the file inside a folder and an optional folder name. Read more about the upload method in the [upload docs](https://cloudinary.com/documentation/image_upload_api_reference#upload_method).

`handleCloudinaryDelete` passes an array of public IDs to the `api.delete_resources` method for deletion. Read all about this method in the [cloudinary admin api docs](https://cloudinary.com/documentation/admin_api#delete_resources).

That's it for for the `lib` folder.

---

Moving on to our API routes. API routes are a core part of Next.js. Read about API routes in Next.js [here](https://nextjs.org/docs/api-routes/introduction).

Create a folder called `images` inside `pages/api`. Create a new file called `index.js` inside `pages/api/images`. This file will handle http requests made to the `/api/images` endpoint.

Paste the following code inside `pages/api/images/index.js`.

```js
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
  console.log("post received");
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

```

A Next.js API route needs to have a default export that is a function which takes in the incoming request object and the outgoing response object. Read about this in the [docs](https://nextjs.org/docs/api-routes/introduction)

At the top we export a custom config object. The custom configuration let's next.js know that we don't want to use the default body parser. Instead, the body is going to be a stream and that way we can parse it using formidable. [See here](https://nextjs.org/docs/api-routes/api-middlewares#:~:text=bodyParser%20Enables%20body%20parsing%2C%20you%20can%20disable%20it%20if%20you%20want%20to%20consume%20it%20as%20a%20Stream%3A). Read more about custom config and API middleware in the [next.js docs](https://nextjs.org/docs/api-routes/api-middlewares#custom-config).

Inside our `handler` function, we check the incoming http request method. We only want to handle GET and POST methods so we use a switch case statement to check for that and return a 405 - Method Not Allowed response if the request method doesn't match any of our cases. 

`handleGetRequest` calls the `handleGetCloudinaryUploads` function that we created earlier to get all uploaded resources.

`handlePostRequest` takes in the incoming request object. It first passes the request object to the `parseForm` function that we created earlier. `parseForm` parses the form data. In the form data we have a `layout` field and then fields that contain section data(width,height,x,y) for each image uploaded. The form data also contains each uploaded file. We first get the layout data by parsing the stringified JSON. We have a `transformation` array. This is what cloudinary will use to determine where to overlay our images. Read more [here](https://cloudinary.com/documentation/image_upload_api_reference#:~:text=transformations%20is%20completed.-,transformation,-String).

We loop through the files that have been uploaded. For each file/image, we upload the image to cloudinary, then create a transformation object that we'll append to the `transformation` array. The transformation object contains the `overlay` field, which is the public id, the `width` and `height` of the section where the image will be placed, the `x` and `y` co-ordinates of the section and then `crop` and `gravity`. Read about [placing layer overlays on images](https://cloudinary.com/documentation/layers) for more information. For the `crop` field, we set it to `fill` so that the image maintains its aspect ratio. You can change this to your liking. Read about it [here](https://cloudinary.com/documentation/transformation_reference#c_crop_resize). For the `gravity`, we set it to `north_west` to tell cloudinary that all x and y values are relative to the top-left corner. In short the top-left will be the origin(0,0). Read more about it [here](https://cloudinary.com/documentation/transformation_reference#g_gravity).

We need a background image where we're going to overlay our already uploaded images/sections. For this we're going to be using the canvas package we installed to create a canvas, fill it with the color white and then get the canvas as an image(Buffer data). We then convert that buffer to a base64 string and upload it to cloudinary. We also pass the transformation array that we defined. At this point the transformation array will contain a transformation object for each of our images. We then delete the initially uploaded images since they have been added as overlays to the background image and we no longer need them.

> You can also place the overlays using the canvas and just upload the final image to cloudinary(would be cheaper in terms of cloudinary tokens/storage) but I wanted to do everything using cloudinary so we can touch on cloudinary transformations.

---

Create a new file called `[...id].js` under `pages/api/images/` folder. Paste the following code inside `pages/api/images/[...id].js`.

```js
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { handleCloudinaryDelete } from "../../../lib/cloudinary";

/**
 * @type {NextApiHandler}
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  let { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  if (Array.isArray(id)) {
    id = id.join("/");
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const result = await handleDeleteRequest(id);

        return res.status(200).json({ message: "Success", result });
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

const handleDeleteRequest = async (id) => {
  const result = await handleCloudinaryDelete([id]);

  return result;
};

```

This file handles requests made to the `/api/images/:id` endoint. This is a dynamic API route. Read about it [here](https://nextjs.org/docs/api-routes/dynamic-api-routes). The destructured array syntax for the file name is used to match all routes that come after a dynamic route. For example to handle routes such as `/api/images/:id/:anotherId/`  or `/api/images/:id/someAction/` instead of just `/api/images/:id`. Read about [catching all api routes](https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes). 

This route only handles DELETE requests. We get the id from the incoming request query and pass that to `handleCloudinaryDelete` for deletion.

That's it for the backend.

---

Now for the frontend.

Replace the contents of `styles/globals.css` with the following

```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

:root {
  --color-primary: #0070f3;
  --color-danger: #ff0000;
}

* {
  box-sizing: border-box;
}

img {
  object-fit: cover;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.danger {
  color: var(--color-danger);
}

.btn {
  background-color: var(--color-primary);
  border-radius: 2px;
  border: none;
  color: #fff;
  text-transform: uppercase;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 50px;
}

.btn.danger {
  color: #ffffff;
  background-color: var(--color-danger);
}

.btn:hover:not([disabled]) {
  filter: brightness(96%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

```

Some simple CSS.

Create a folder at the root of your project and name it `components`. Create a new file called `Layout.jsx` under `components` folder. Paste the following inside `components/Layout.jsx`.

```jsx
import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Photo collage with cloudinary</title>
        <meta name="description" content="Photo collage with cloudinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>

        <Link href="/images">
          <a>Images</a>
        </Link>
      </nav>
      <main>{children}</main>
      <style jsx>{`
        nav {
          height: 100px;
          background-color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #ffffff;
          font-weight: bold;
        }
        main {
          width: 100vw;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

```

We're going to be wrapping all our pages in this component so that we have a consistent layout without the code duplication.

Create a file called `CollageLayout.jsx` under `components`. Paste the following inside `components/CollageLayout.jsx`.

```jsx
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

/**
 * @typedef {Object} Collage
 * @property {File} file
 * @property {Section} section
 */

/**
 * @typedef {Object} Section
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 */

/**
 *
 * @param {{layout:import('../lib/collageLayouts').CollageLayout} props
 */
export default function CollageLayout({ layout }) {
  const router = useRouter();

  /**
   * @type [{[key:string]: Collage},(images: {[key:string]: Collage}) => void]
   */
  const [images, setImages] = useState({});

  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "layout",
        JSON.stringify({
          width: layout.width,
          height: layout.height,
        })
      );

      for (const [key, image] of Object.entries(images)) {
        formData.append(key, JSON.stringify(image.section));
        formData.append(key, image.file);
      }

      setLoading(true);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      router.push("/images");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="collage-layout-wrapper" onSubmit={handleFormSubmit}>
      <div
        className="collage-layout"
        style={{
          position: "relative",
          width: layout.width,
          height: layout.height,
        }}
      >
        {layout.sections().map((section, index) => (
          <div
            className="collage-section"
            key={`section-${index}`}
            style={{
              position: "absolute",
              width: section.width,
              height: section.height,
              left: section.x,
              top: section.y,
              border: "2px solid black",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
            }}
          >
            {images[`layout-${layout.id}-image-${index}`] &&
            images[`layout-${layout.id}-image-${index}`].file ? (
              <div className="image-preview">
                <Image
                  src={URL.createObjectURL(
                    images[`layout-${layout.id}-image-${index}`].file
                  )}
                  alt={`preview image ${index}`}
                  layout="fill"
                ></Image>
              </div>
            ) : (
              <div className="file-input">
                <label htmlFor={`layout-${layout.id}-image-${index}`}>
                  Select Image
                </label>

                <input
                  type="file"
                  name={`layout-${layout.id}-image-${index}`}
                  id={`layout-${layout.id}-image-${index}`}
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    setImages({
                      ...images,
                      [event.target.name]: {
                        file: event.target.files[0],
                        section,
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn"
        type="submit"
        disabled={
          Object.keys(images).length !== layout.sections().length ||
          !Object.values(images).every(
            (image) => image.file && image.section
          ) ||
          loading
        }
      >
        {loading ? "Uploading ..." : "Upload"}
      </button>

      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background-color: #ececec;
          border-radius: 5px;
        }

        form button {
          width: 100%;
        }

        form div.collage-layout div.collage-section div.image-preview {
          height: 100%;
          width: 100%;
          position: relative;
          object-fit: cover;
        }

        form div.collage-layout div.collage-section div.file-input {
          height: 100%;
          width: 100%;
        }

        form div.collage-layout div.collage-section div.file-input label {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        form div.collage-layout div.collage-section div.file-input label:hover {
          background-color: #ececec;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}

```

This is where the frontend magic happens. The component takes in a layout. _i.e. One of those layouts from the layouts array inside `lib/collageLayouts.js`._ The component uses the layout data to create a container of the layout width and height,

```jsx
<div
    className="collage-layout"
    style={{
        position: "relative",
        width: layout.width,
        height: layout.height,
    }}
>
...
</div>
```

and then the sections data to create different sections inside the container

```jsx
{layout.sections().map((section, index) => (
<div
className="collage-section"
key={`section-${index}`}
style={{
    position: "absolute",
    width: section.width,
    height: section.height,
    left: section.x,
    top: section.y,
    border: "2px solid black",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
}}
></div>))}
```

These are all inside of a form element. Each different section checks the `images` state, if an image hasn't been chosen for that section, it displays an input element so the user can select an image. If an image has been selected, it shows a preview of that image. 

Let's talk about the `images` state. `images` will be an object of the following structure

```ts

// A typescript interface
interface Images {
    // Can have any key of type string and value of type object
    [key:string]: {
        // Object Has a file key that has a value of type File
        file: File;
        // Object Has a section key with a value of type object
        section: {
            // Object has a width key with value of number
            width: number;
            // Object has a height key with value of number
            height: number;
            // Object has a x key with value of number
            x: number;
            // Object has a y key with value of number
            y: number;
        }
    }
}

// For example

const images = {
    "layout-1-image-0":{
        file: new File(),
        section:{
            width: 800,
            height: 800,
            x: 0,
            y: 400
        }
    },
    "layout-1-image-1":{
        file: new File(),
        section:{
            width: 600,
            height: 700,
            x: 300,
            y: 100
        }
    }
}
```

With that in mind, let's look at the `handleFormSubmit`. This is triggered when a user clicks on upload. We first create a new form data object. 

```jsx
const formData = new FormData();
```

We append the stringified layout data to the form data. 

```jsx
formData.append(
    "layout",
    JSON.stringify({
        width: layout.width,
        height: layout.height,
    })
);
```

Then for every section/image, we append to the formdata the actual image file and also the stringified section data.

```jsx
for (const [key, image] of Object.entries(images)) {
    formData.append(key, JSON.stringify(image.section));
    formData.append(key, image.file);
}
```

We then post the form data to the `/api/images` endpoint and navigate to the `/images` page on success.

At the top of the component we also have the use of some React hooks such as `useState`. I'm assuming you are familiar with React and that's why I'm not going into too much detail. You can have a read in the React docs. Read more about `useRouter` in the [Next.js router docs](https://nextjs.org/docs/api-reference/next/router)

---

Paste the following inside `pages/index.jsx`. If you have `pages/index.js` instead, you can just paste there or change the extension to `.jsx`

> TIP: Change your frontend components/pages to `.jsx` for better intellisense and code completion

```jsx
import CollageLayout from "../components/CollageLayout";
import Layout from "../components/Layout";
import { layouts } from "../lib/collageLayouts";

export default function Home() {
  return (
    <Layout>
      <div className="wrapper">
        <h1>Photo collages with Cloudinary + Next.js</h1>
        <p>
          Identify a desired layout below, select your images and click on
          upload
        </p>
        <p>You can create more layouts in lib/collageLayouts.js</p>
        <div className="collage-layouts">
          {layouts.map((layout, index) => {
            return (
              <CollageLayout
                key={`layout-${index}`}
                layout={layout}
              ></CollageLayout>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        div.wrapper {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        div.wrapper div.collage-layouts {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }
      `}</style>
    </Layout>
  );
}

```

Nothing complicated happening here.

---

Create a file called `images.jsx` under `pages/` folder. Paste the following inside `pages/images.jsx`

```jsx
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Images() {
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const getImages = useCallback(async function () {
    try {
      setLoading(true);

      const response = await fetch("/api/images", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setImages(data.result.resources);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getImages();
  }, [getImages]);

  const handleDownloadResource = async (url) => {
    try {
      setLoading(true);

      console.log(url);

      const response = await fetch(url, {});

      if (response.ok) {
        const blob = await response.blob();

        const fileUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;

        a.download = `photo-collage.${url.split(".").at(-1)}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      throw await response.json();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      getImages();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {images.length > 0 ? (
        <div className="wrapper">
          <div className="images-wrapper">
            {images.map((image) => {
              return (
                <div className="image-wrapper" key={image.public_id}>
                  <div className="image">
                    <Image
                      src={image.secure_url}
                      width={image.width}
                      height={image.height}
                      layout="responsive"
                      alt={image.secure_url}
                    ></Image>
                  </div>
                  <div className="actions">
                    <button
                      className="btn"
                      disabled={loading}
                      onClick={() => {
                        handleDownloadResource(image.secure_url);
                      }}
                    >
                      Download
                    </button>
                    <button
                      className="btn danger"
                      disabled={loading}
                      onClick={() => {
                        handleDelete(image.public_id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {!loading && images.length === 0 ? (
        <div className="no-images">
          <b>No Images Yet</b>
          <Link href="/">
            <a className="btn">Upload some images</a>
          </Link>
        </div>
      ) : null}
      {loading && images.length === 0 ? (
        <div className="loading">
          <b>Loading...</b>
        </div>
      ) : null}
      <style jsx>{`
        div.wrapper {
          min-height: 100vh;
          background-color: #f4f4f4;
        }

        div.wrapper div.images-wrapper {
          display: flex;
          flex-flow: row wrap;
          gap: 10px;
          padding: 10px;
        }

        div.wrapper div.images-wrapper div.image-wrapper {
          flex: 0 0 400px;
          display: flex;
          flex-flow: column;
        }

        div.wrapper div.images-wrapper div.image-wrapper div.image {
          background-color: #ffffff;
          position: relative;
          width: 100%;
        }

        div.wrapper div.images-wrapper div.image-wrapper div.actions {
          background-color: #ffffff;
          padding: 10px;
          display: flex;
          flex-flow: row wrap;
          gap: 10px;
        }

        div.loading,
        div.no-images {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: column;
          gap: 10px;
        }
      `}</style>
    </Layout>
  );
}

```

This component uses the React `useEffect` hook, to run the memoized `getImages` function. Read more about [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) and [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback).

`getImages` makes a GET request to the `/api/images` endpoint to get all uploaded images.

`handleDelete` makes a DELETE request to `/api/images/:id` to delete the resource/image with the given id.

For the body of the component, we just show the images in a flexbox container along with a delete and download button.

---

One more thing we need to do. We need to add the cloudinary domain to our next.js configuration.

Modify `next.config.js` and add the following.

```js
module.exports = {
  // ...others
  images: {
    domains: ["res.cloudinary.com"],
  },
};
```

This is to enable Next.js to optimize the images that we're showing using the [Image](https://nextjs.org/docs/api-reference/next/image) component. Read more about this [here](https://nextjs.org/docs/api-reference/next/image#domains).

And that's it. You can now run your application

```bash
npm run dev
```

You can find the full source code on my [Github](https://github.com/newtonmunene99/photo-collage-with-cloudinary). If you'd like a challenge or some homework, try and figure out how you can add a border to your layouts.