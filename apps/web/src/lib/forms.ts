import { Index } from "@/__registry__";

const REGISTRY_BLOCK_TYPES = ["registry:form"];
const BLOCKS_WHITELIST_PREFIXES = ["sign"];
export async function getAllFormIds() {
  const forms = await _getAllBlocks();
  return forms.map((form: any) => form.name);
}

async function _getAllBlocks() {
  const index = Index;

  return Object.values(index).filter((form: any) => {
    return BLOCKS_WHITELIST_PREFIXES.some(
      (prefix) =>
        form.link.startsWith(prefix) && REGISTRY_BLOCK_TYPES.includes(form.type)
    );
  });
}
