export const destinationImages = {
  munnar: "/images/destinations/munnar.jpg",
  wayanad: "/images/destinations/wayanad.jpg",
  kochi: "/images/destinations/kochi.jpg",
  alleppey: "/images/destinations/alleppey.jpg",
} as const;

export const attractionImages: Record<string, string> = {
  "Tea Museum":
    "/images/attractions/tea-museum.jpg",

  "Mattupetty Dam":
    "/images/attractions/mattupetty-dam.jpg",

  "Edakkal Caves":
    "/images/attractions/edakkal-caves.jpg",

  "Banasura Sagar Dam":
    "/images/attractions/banasura-dam.jpg",

  "Fort Kochi":
    "/images/attractions/fort-kochi.jpg",

  "Chinese Fishing Nets":
    "/images/attractions/chinese-fishing-nets.jpg",

  "Alleppey Backwaters":
    "/images/attractions/alleppey-backwaters.jpg",
};

export function getDestinationImage(slug: string) {
  return (
    destinationImages[
      slug as keyof typeof destinationImages
    ] ?? destinationImages.munnar
  );
}

export function getAttractionImage(
  name: string,
  destinationSlug: string
) {
  return (
    attractionImages[name] ??
    getDestinationImage(destinationSlug)
  );
}