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
