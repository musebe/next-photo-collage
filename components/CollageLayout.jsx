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
