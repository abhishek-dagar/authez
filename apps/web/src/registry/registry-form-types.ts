export const formType = [
  {
    name: "identity-and-password",
    label: "Identity and Password",
  },
  {
    name: "identity-first",
    label: "identity first",
  },
] as const;

export type FormType = (typeof formType)[number];
