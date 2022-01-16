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
