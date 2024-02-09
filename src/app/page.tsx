import dynamic from "next/dynamic";

const CallFunctions = dynamic(() => import("@/components/CallFunctions"), { ssr: false })

export default function Home() {
  return (
    <CallFunctions />
  );
}
