"use client";

import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

// import CompressVideo from "@/components/CompressVideo";
// import NoSSRWrapper from "@/components/NoSSRWrapper";

export default function Page() {
  return (
    <div>
      <h1 className="sr-only">Video Compressor</h1>
      {/* <NoSSRWrapper><CompressVideo /></NoSSRWrapper> */}
      <RelatedPrivacyGuides toolPath="/tools/compress-video" />
    </div>
  );
}

