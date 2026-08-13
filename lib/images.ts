export const destinationImages = {
  munnar:
    "https://cdn.mos.cms.futurecdn.net/v2/t%3A0%2Cl%3A250%2Ccw%3A1500%2Cch%3A1125%2Cq%3A80%2Cw%3A1500/yxTg4K2Snd6DfDzxEPXhtj.jpg",

  wayanad:
    "https://gotravelinglife.com/wp-content/uploads/2024/02/51822825467_52e323fee1_c.jpg",

  kochi:
    "https://pub-d8970c901de34c218926ebf4be1ed09a.r2.dev/destinations/kochi.jpg",

  alleppey:
    "https://southernindiabycaranddriver.com/wp-content/uploads/2022/06/Alappey-One-Day-Tour-house-boat-tour-Top-destination-in-Kerala-Southern-India-By-Car-and-Driver.jpg",
} as const;

export const attractionImages: Record<
  string,
  string
> = {
  "Tea Museum":
    "https://www.keralatourism.org/uploads/touristplaces/large/teanuseummunnar20231109110502_351_1.jpg",

  "Mattupetty Dam":
    "https://karthicktravels.com/assets/img/tours/munnar/2.jpg",

  "Edakkal Caves":
    "https://gotravelinglife.com/wp-content/uploads/2024/02/51822825467_52e323fee1_c.jpg",

  "Fort Kochi":
    "https://res.cloudinary.com/kmadmin/image/upload/v1551172540/kiomoi/Kochi/Fort-Kochi.jpg",

  "Alleppey Backwaters":
    "https://southernindiabycaranddriver.com/wp-content/uploads/2022/06/Alappey-One-Day-Tour-house-boat-tour-Top-destination-in-Kerala-Southern-India-By-Car-and-Driver.jpg",
};

export function getDestinationImage(
  slug: string
) {
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