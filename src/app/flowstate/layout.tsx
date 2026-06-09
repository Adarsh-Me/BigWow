import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowState - AI-Powered Productivity OS | BigWow",
  description: "Experience FlowState, the local-first focus workspace and developer command deck. Run tools securely in one browser tab with zero latency and complete privacy.",
  openGraph: {
    title: "FlowState - AI-Powered Productivity OS | BigWow",
    description: "Experience FlowState, the local-first focus workspace and developer command deck.",
    type: "website",
    siteName: "BigWow",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowState - AI-Powered Productivity OS | BigWow",
    description: "Experience FlowState, the local-first focus workspace and developer command deck.",
    images: ["/og-image.png"],
  },
};

export default function FlowStateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
