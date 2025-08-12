import dynamic from "next/dynamic";

// Import dinamico per evitare SSR su componenti che usano window/document
const TarocardSite = dynamic(() => import("../components/TarocardSite"), {
  ssr: false
});

export default function Home() {
  return <TarocardSite />;
}
