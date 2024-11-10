import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-headers";
import PreComponent from "@/components/pre-component";
import React from "react";

const FormLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>Auth Forms</PageHeaderHeading>
        <PageHeaderDescription>
          Pre-built form with different flows
        </PageHeaderDescription>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-sm text-muted-foreground">
            First Initialize the shadcn ui in your project
          </p>
          <PreComponent value={"npx shadcn@latest init"} />
        </div>
      </PageHeader>
      <div className="container py-6">
        <section id="blocks" className="scroll-mt-24">
          {children}
        </section>
      </div>
    </div>
  );
};

export default FormLayout;
