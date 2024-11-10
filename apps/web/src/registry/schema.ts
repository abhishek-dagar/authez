import { z } from "zod";

export const registryItemTypeSchema = z.enum(["registry:form"]);

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema,
  target: z.string().optional(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
  isDummy: z.boolean().optional(),
});
export const registryEntrySchema = registryItemSchema.extend({
  category: z.string().optional(),
  subcategory: z.string().optional(),
});
