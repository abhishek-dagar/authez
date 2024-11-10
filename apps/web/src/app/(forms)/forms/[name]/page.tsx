import * as React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// import { siteConfig } from "@/config/site";
// import { getAllBlockIds } from "@/lib/blocks"
import { absoluteUrl, cn } from "@/lib/utils";

import "@/styles/mdx.css";
import { getRegistryComponent, getRegistryItem } from "@/lib/registry";

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    name: string;
  }>;
}): Promise<Metadata> {
  const { name } = await params;
  const item = await getCachedRegistryItem(name);

  if (!item) {
    return {};
  }

  const title = item.name;
  const description = item.description;

  return {
    title: `${item.name}${item.description ? ` - ${item.description}` : ""}`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/forms/${item.name}`),
    },
  };
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string;
  }>;
}) {
  const { name } = await params;
  const item = await getCachedRegistryItem(
    name === "sign-up" ? name : "identify-and-password"
  );
  const Component = getRegistryComponent(
    name === "sign-up" ? name : "identify-and-password"
  );
  if (!item || !Component) {
    return notFound();
  }

  return (
    <>
      <div
        className={cn(
          "themes-wrapper bg-background font-[family-name:var(--font-geist-sans)]",
          item.meta?.containerClassName
        )}
      >
        <Component />
      </div>
    </>
  );
}
