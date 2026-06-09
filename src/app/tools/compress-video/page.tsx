"use client";

import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

// import CompressVideo from "@/components/CompressVideo";
// import NoSSRWrapper from "@/components/NoSSRWrapper";

export default function Page() {
  return (
    <div>
      {/* <NoSSRWrapper><CompressVideo /></NoSSRWrapper> */}
      <RelatedPrivacyGuides toolPath="/tools/compress-video" />
    </div>
  );
}

