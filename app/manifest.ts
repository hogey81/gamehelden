import type { MetadataRoute } from "next";

// Lets visitors add Gamehelden to their home screen. iPhones only allow push notifications
// for sites added that way.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gamehelden",
    short_name: "Gamehelden",
    description: "De nieuwste video's en livestreams van Nederlandse gaming-YouTubers.",
    start_url: "/favorieten",
    display: "standalone",
    background_color: "#F5F6FA",
    theme_color: "#E85A0C",
    lang: "nl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
