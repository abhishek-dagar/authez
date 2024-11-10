import { MainNavItem, SidebarNavItem } from "@/types/nav";

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  //   chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Providers",
      href: "/docs/providers/google",
    },
    {
      title: "Forms",
      href: "/forms",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
      ],
    },
    {
      title: "Installation",
      items: [
        {
          title: "Next.js",
          href: "/docs/installation/next",
          items: [],
        },
        {
          title: "More coming soon",
          href: "/docs/installation/next",
          items: [],
          disabled: true,
        },
      ],
    },
    {
      title: "Providers",
      items: [
        {
          title: "Google",
          href: "/docs/providers/google",
          items: [],
        },
        {
          title: "Github",
          href: "/docs/providers/github",
          items: [],
        },
        {
          title: "More coming soon",
          href: "/docs/providers/github",
          items: [],
          disabled: true,
        },
      ],
    },
  ],
};
