export function fixImport(content: string) {
    const regex = /@repo\/(.+?)\/((?:.*?\/)?(?:ui))\/([\w-]+)/g;
    const regexRegistry = /@\/registry\/((?:.*?\/)?(?:lib))\/([\w-]+)/g;
  
    // console.log(content);
    const replacement = (
      match: string,
      path: string,
      type: string,
      component: string
    ) => {
      if (type.endsWith("ui")) {
        return `@/components/ui/${component}`;
      }
  
      return match;
    };
    const regReplacement = (
      match: string,
      path: string,
      type: string,
      component: string
    ) => {
      if (match.startsWith("@/registry/lib")) {
        return match.replace("@/registry/lib", "@/lib");
      }
  
      return match;
    };
    return content
      .replace(regex, replacement)
      .replace(regexRegistry, regReplacement)
      .replace("/forms", "");
  }