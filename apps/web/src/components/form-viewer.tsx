"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Clipboard,
  File,
  Folder,
  Fullscreen,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { z } from "zod";

import { trackEvent } from "@/lib/events";
import { useCopyToClipboard } from "@repo/ui/hooks/use-copy-to-clipboard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/ui/resizable";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@repo/ui/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/ui/toggle-group";
import { Button } from "@repo/ui/components/ui/button";
import { registryEntrySchema, registryItemFileSchema } from "@/registry/schema";
import { createFileTreeForRegistryItemFiles } from "@/lib/registry";

type FormViewerContext = {
  item: z.infer<typeof registryEntrySchema>;
  view: "code" | "preview";
  setView: (view: "code" | "preview") => void;
  style?: "default";
  setStyle: (style: "default") => void;
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  resizablePanelRef: React.RefObject<ImperativePanelHandle> | null;
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
  highlightedFiles:
    | (z.infer<typeof registryItemFileSchema> & {
        highlightedContent: string;
      })[]
    | null;
};

const FormViewerContext = React.createContext<FormViewerContext | null>(null);

function useFormViewer() {
  const context = React.useContext(FormViewerContext);
  if (!context) {
    throw new Error("useFormViewer must be used within a FormViewerProvider.");
  }
  return context;
}

function FormViewerProvider({
  item,
  tree,
  highlightedFiles,
  children,
}: Pick<FormViewerContext, "item" | "tree" | "highlightedFiles"> & {
  children: React.ReactNode;
}) {
  const [view, setView] = React.useState<FormViewerContext["view"]>("preview");
  const [style, setStyle] =
    React.useState<FormViewerContext["style"]>("default");
  const [activeFile, setActiveFile] = React.useState<
    FormViewerContext["activeFile"]
  >(highlightedFiles?.[0]?.target ?? null);
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);

  return (
    <FormViewerContext.Provider
      value={{
        item,
        view,
        setView,
        style,
        setStyle,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
      }}
    >
      <div
        id={item.name}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
        style={
          {
            "--height": item.meta?.iframeHeight ?? 450,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </FormViewerContext.Provider>
  );
}

function FormViewerToolbar() {
  const { setView, item, resizablePanelRef, style } = useFormViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <div className="flex w-full items-center gap-2 md:pr-[14px]">
      <Tabs
        defaultValue="preview"
        onValueChange={(value) => setView(value as "preview" | "code")}
        className="hidden lg:flex"
      >
        <TabsList className="h-7 items-center rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
          <TabsTrigger
            value="preview"
            className="h-[1.45rem] rounded-sm px-2 text-xs"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="h-[1.45rem] rounded-sm px-2 text-xs"
          >
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator orientation="vertical" className="mx-2 hidden h-4 lg:flex" />
      <a
        href={`#${item.name}`}
        className="text-sm font-medium underline-offset-2 hover:underline"
      >
        {item.description}
      </a>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden h-7 w-7 rounded-md border bg-transparent shadow-none md:flex lg:w-auto"
          size="sm"
          onClick={() => {
            copyToClipboard(`npx shadcn@latest add ${name}`);
          }}
        >
          {isCopied ? <Check /> : <Terminal />}
          <span className="hidden lg:inline">npx authez add -f {item.name}</span>
        </Button>
        <Separator orientation="vertical" className="mx-2 hidden h-4 md:flex" />
        <div className="hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={(value: string) => {
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value));
              }
            }}
          >
            <ToggleGroupItem
              value="100"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="60"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <Separator orientation="vertical" className="h-4" />
            <Button
              size="icon"
              variant="ghost"
              className="h-[22px] w-[22px] rounded-sm p-0"
              asChild
              title="Open in New Tab"
            >
              <Link href={`/forms/${item.name}`} target="_blank">
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}

function FormViewerView() {
  const { item, resizablePanelRef } = useFormViewer();

  return (
    <div className="h-[--height] group-data-[view=code]/block-view-wrapper:hidden">
      <div className="grid w-full gap-4">
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel
            ref={resizablePanelRef}
            className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            <Image
              src={`/images/blocks/${item.name}.png`}
              alt={item.name || "temp"}
              data-block={item.name}
              width={1440}
              height={900}
              className="absolute left-0 top-0 z-20 w-[970px] max-w-none bg-background data-[block=sidebar-10]:left-auto data-[block=sidebar-10]:right-0 data-[block=sidebar-11]:-top-1/3 data-[block=sidebar-14]:left-auto data-[block=sidebar-14]:right-0 data-[block=login-01]:max-w-full data-[block=sidebar-13]:max-w-full data-[block=sidebar-15]:max-w-full dark:hidden sm:w-[1280px] md:hidden md:dark:hidden"
            />
            <Image
              src={`/images/blocks/${item.name}-dark.png`}
              alt={item.name || "temp"}
              data-block={item.name}
              width={1440}
              height={900}
              className="absolute left-0 top-0 z-20 hidden w-[970px] max-w-none bg-background data-[block=sidebar-10]:left-auto data-[block=sidebar-10]:right-0 data-[block=sidebar-11]:-top-1/3 data-[block=sidebar-14]:left-auto data-[block=sidebar-14]:right-0 data-[block=login-01]:max-w-full data-[block=sidebar-13]:max-w-full data-[block=sidebar-15]:max-w-full dark:block sm:w-[1280px] md:hidden md:dark:hidden"
            />
            <iframe
              src={`/forms/${item.name}`}
              height={item.meta?.iframeHeight ?? 450}
              className="chunk-mode relative z-20 hidden w-full bg-background md:block"
            />
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function FormViewerCode() {
  const { activeFile, highlightedFiles } = useFormViewer();

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile);
  }, [highlightedFiles, activeFile]);

  if (!file) {
    return null;
  }

  return (
    <div className="mr-[14px] flex h-[--height] overflow-hidden rounded-xl bg-zinc-950 text-white group-data-[view=preview]/block-view-wrapper:hidden">
      <div className="w-[280px]">
        <FormViewerFileTree />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b border-zinc-700 bg-zinc-900 px-4 text-sm font-medium">
          <File className="size-4" />
          {file.target}
          <div className="ml-auto flex items-center gap-2">
            <BlockCopyCodeButton />
          </div>
        </div>
        <div
          key={file?.path}
          data-rehype-pretty-code-figure
          dangerouslySetInnerHTML={{ __html: file?.highlightedContent ?? "" }}
          className="relative flex-1 overflow-hidden after:absolute after:inset-y-0 after:left-0 after:w-10 after:bg-zinc-950 [&_.line:before]:sticky [&_.line:before]:left-2 [&_.line:before]:z-10 [&_.line:before]:translate-y-[-1px] [&_.line:before]:pr-1 [&_pre]:h-[--height] [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:pb-20 [&_pre]:pt-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </div>
    </div>
  );
}

export function FormViewerFileTree() {
  const { tree } = useFormViewer();

  if (!tree) {
    return null;
  }

  return (
    <SidebarProvider className="flex !min-h-full flex-col">
      <Sidebar
        collapsible="none"
        className="w-full flex-1 border-r border-zinc-700 bg-zinc-900 text-white"
      >
        <SidebarGroupLabel className="h-12 rounded-none border-b border-zinc-700 px-4 text-sm text-white">
          Files
        </SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {tree.map((file: any, index: number) => (
                <Tree key={index} item={file} index={1} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  );
}

function Tree({ item, index }: { item: any; index: number }) {
  const { activeFile, setActiveFile } = useFormViewer();

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          className="whitespace-nowrap rounded-none pl-[--index] hover:bg-zinc-700 hover:text-white focus:bg-zinc-700 focus:text-white focus-visible:bg-zinc-700 focus-visible:text-white active:bg-zinc-700 active:text-white data-[active=true]:bg-zinc-700 data-[active=true]:text-white"
          data-index={index}
          style={
            {
              "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="invisible" />
          <File className="h-4 w-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="whitespace-nowrap rounded-none pl-[--index] hover:bg-zinc-700 hover:text-white focus-visible:bg-zinc-700 focus-visible:text-white active:bg-zinc-700 active:text-white data-[active=true]:bg-zinc-700 data-[active=true]:text-white data-[state=open]:hover:bg-zinc-700 data-[state=open]:hover:text-white"
            style={
              {
                "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="h-4 w-4 transition-transform" />
            <Folder className="h-4 w-4" />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full border-none p-0">
            {item.children.map((subItem: any, key: number) => (
              <Tree key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function BlockCopyCodeButton() {
  const { activeFile, item } = useFormViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const file = React.useMemo(() => {
    return item.files?.find((file: any) => file.target === activeFile);
  }, [activeFile, item.files]);

  const content = file?.content;

  if (!content) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        copyToClipboard(content);
        trackEvent({
          name: "copy_block_code",
          properties: {
            name: item.name,
            file: file.path,
          },
        });
      }}
      className="h-7 w-7 shrink-0 rounded-lg p-0 hover:bg-zinc-700 hover:text-white focus:bg-zinc-700 focus:text-white focus-visible:bg-zinc-700 focus-visible:text-white active:bg-zinc-700 active:text-white data-[active=true]:bg-zinc-700 data-[active=true]:text-white [&>svg]:size-3"
      variant="ghost"
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  );
}

function FormViewer({
  item,
  tree,
  highlightedFiles,
  ...props
}: Pick<FormViewerContext, "item" | "tree" | "highlightedFiles">) {
  if (item.isDummy) return null;
  return (
    <FormViewerProvider
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      {...props}
    >
      <FormViewerToolbar />
      <FormViewerView />
      <FormViewerCode />
    </FormViewerProvider>
  );
}

export { FormViewer };
