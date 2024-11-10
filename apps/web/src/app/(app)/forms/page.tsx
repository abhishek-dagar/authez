import FormDisplay from "@/components/form-display";
import { getAllFormIds } from "@/lib/forms";
import React from "react";
import "@/styles/mdx.css";

const FormsPage = async () => {
  const forms = await getAllFormIds();
  return (
    <div className="gap-3 md:flex md:flex-row-reverse md:items-start">
      <div className="grid flex-1 gap-12 md:gap-24 lg:gap-48">
        {forms.map((name) => (
          <FormDisplay key={name} name={name} />
        ))}
      </div>
    </div>
  );
};

export default FormsPage;
