import React from "react";
import { FormViewer } from "./form-viewer";

import { highlightCode } from "@/lib/highlight-code";
import {
  createFileTreeForRegistryItemFiles,
  getRegistryItem,
} from "@/lib/registry";

const FormDisplay = async ({ name }: { name: string }) => {
  const item = await getCachedRegistryItem(name);

  if (!item?.files) {
    return null;
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ]);

  delete item.component;

  return (
    <FormViewer
      item={{ ...item }}
      tree={tree}
      highlightedFiles={highlightedFiles}
    />
  );
};

const getCachedRegistryItem = async (name: string) => {
  return await getRegistryItem(name);
};

const getCachedFileTree = React.cache(
  async (files: Array<{ path: string; target?: string }>) => {
    if (!files) {
      return null;
    }

    return await createFileTreeForRegistryItemFiles(files);
  }
);

const getCachedHighlightedFiles = React.cache(async (files: any[]) => {
  return await Promise.all(
    files.map(async (file) => ({
      ...file,
      highlightedContent: await highlightCode(file.content ?? ""),
    }))
  );
});

export default FormDisplay;
