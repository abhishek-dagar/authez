import { Button } from "@repo/ui/components/ui/button";
import FlickeringGrid from "@repo/ui/components/ui/flickering-grid";
import { Icons, Logo } from "@repo/ui/icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-70px)] w-full flex items-center justify-center">
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
      <div className="z-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-8">
          <Logo size={100} />
          <div className="text-center">
            <h1 className="text-6xl font-bold">Auth Ez</h1>
            <p>CLI for Adding Auth</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href={"/docs"}>Get Started</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"#"}>
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
