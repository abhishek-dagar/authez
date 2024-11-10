import React from "react";
import About from "@/content/docs/providers/github.mdx";

const page = () => {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <About />
      </div>
    </main>
  );
};

export default page;
