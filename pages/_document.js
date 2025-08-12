import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        {/* Tailwind via CDN per evitare installazioni */}
        <script src="https://cdn.tailwindcss.com" />
        {/* Leaflet CSS (mappa) */}
        <link
          id="leaflet-style"
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </Head>
      <body className="bg-white text-neutral-900">
        <Main />
        <NextScript />
        {/* Leaflet JS (mappa) */}
        <script
          id="leaflet-script"
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          async
        />
      </body>
    </Html>
  );
}

