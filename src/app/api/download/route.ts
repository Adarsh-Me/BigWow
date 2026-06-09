import { NextRequest, NextResponse } from "next/server";

// A list of verified active Cobalt instances from cobalt.directory
const COBALT_INSTANCES = [
  "https://apicobalt.mgytr.top",
  "https://cobalt.omega.wolfy.love",
  "https://lime.clxxped.lol",
  "https://nuko-c.meowing.de",
  "https://api.qwkuns.me",
  "https://cobaltapi.kittycat.boo",
  "https://dog.kittycat.boo",
  "https://cobalt.api.timelessnesses.me",
  "https://co.wuk.sh",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, videoQuality, downloadMode, audioFormat, filenameStyle, tiktokFullAudio } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
    }

    const payload = {
      url,
      videoQuality: videoQuality || "1080",
      downloadMode: downloadMode || "auto",
      audioFormat: audioFormat || "mp3",
      filenameStyle: filenameStyle || "pretty",
      ...(tiktokFullAudio ? { tiktokFullAudio: true } : {}),
    };

    let lastErrorMessage = "All download servers are currently unavailable. Please try again later.";

    for (const instance of COBALT_INSTANCES) {
      try {
        console.log(`[API Download] Trying instance: ${instance}`);
        const response = await fetch(`${instance}/`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          // Short timeout to fallback quickly to next instance if one is slow or down
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          console.warn(`[API Download] Instance ${instance} returned status ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data.status === "error") {
          const code = data.error?.code || data.text || "Unknown error";
          console.warn(`[API Download] Instance ${instance} returned error: ${code}`);
          // If the error is specific to URL/login/auth, we can save it to show the user
          if (code.includes("api.youtube.login") || code.includes("api.auth") || code.includes("error.api")) {
            lastErrorMessage = `The video could not be processed. Server error: ${code}`;
          }
          continue;
        }

        if (data.status === "picker" && data.picker?.length > 0) {
          const downloadUrl = data.picker[0].url;
          if (downloadUrl) {
            console.log(`[API Download] Success from ${instance} (picker format)`);
            return NextResponse.json({ url: downloadUrl });
          }
        }

        if (data.url) {
          console.log(`[API Download] Success from ${instance}`);
          return NextResponse.json({ url: data.url });
        }
      } catch (err: any) {
        console.error(`[API Download] Error connecting to ${instance}:`, err.message || err);
      }
    }

    return NextResponse.json({ error: lastErrorMessage }, { status: 502 });
  } catch (err: any) {
    console.error("[API Download] Global handler error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
