/**
 * Public contact & social links shown in the footer.
 * PLACEHOLDERS — replace with the real TerraScope accounts and address when available.
 */
export const SITE_CONTACT = {
  email: "contact@terrascope.ma",
  location: "Maroc",
} as const;

export type SocialNetwork = "instagram" | "facebook" | "linkedin" | "youtube";

export const SOCIAL_LINKS: { network: SocialNetwork; label: string; href: string }[] = [
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
];
