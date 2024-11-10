import React from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

const PreComponent = ({ value }: { value: string }) => {
  return (
    <pre
      className=" relative max-h-[650px] max-w-[260px] overflow-x-auto rounded-[var(--radius)] border bg-zinc-950 py-2 dark:bg-zinc-900"
      data-language="bash"
      data-theme="github-dark"
      style={{
        backgroundColor: "rgb(36, 41, 46)",
        color: "rgb(225, 228, 232)",
      }}
    >
      <code
        className="relative rounded bg-transparent px-[0.3rem] py-[0.2rem] font-mono text-sm"
        data-language="bash"
        data-theme="github-dark"
      >
        <span className="px-4">{value}</span>
      </code>
      <CopyButton value={value} className={cn("absolute right-4 top-2")} />
    </pre>
  );
};

export default PreComponent;
