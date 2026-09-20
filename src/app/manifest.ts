import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShapeMyMoment — Event Planning & Management",
    short_name: "ShapeMyMoment",
    description:
      "End-to-end event planning, management, and creative networking across South India. Birthdays, weddings, corporate celebrations, rentals and photography.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0b12",
    theme_color: "#5B3A8F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}
