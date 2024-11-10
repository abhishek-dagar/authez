import React from "react";
import { allDocs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { ChevronRightIcon, ExternalLinkIcon } from "@repo/ui/icons";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import Balancer from "react-wrap-balancer";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { badgeVariants } from "@repo/ui/components/ui/badge";
import { DocsPager } from "@/components/docs-pager";
import { DashboardTableOfContents } from "@/components/table-of-content";
import { getTableOfContents } from "@/lib/toc";
import { Mdx } from "@/components/mdx-components";
import "@/styles/mdx.css";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = (await params).slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

const DocsPage = async ({ params }: DocPageProps) => {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <div className="truncate">Docs</div>
          <ChevronRightIcon className="h-3.5 w-3.5" />
          <div className="text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-base text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        {doc.links ? (
          <div className="flex items-center space-x-2 pt-4">
            {doc.links?.doc && (
              <Link
                href={doc.links.doc}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
              >
                Docs
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
            {doc.links?.api && (
              <Link
                href={doc.links.api}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
              >
                API Reference
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : null}
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>
        <DocsPager doc={doc} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
          <ScrollArea className="h-full pb-10">
            {doc.toc && <DashboardTableOfContents toc={toc} />}
          </ScrollArea>
        </div>
      </div>
    </main>
  );
};

export default DocsPage;
