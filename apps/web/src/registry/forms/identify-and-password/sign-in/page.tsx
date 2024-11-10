import SignInForm from "./sign-in-form";

export const description = "A simple login form.";

export const iframeHeight = "670px";

export const containerClassName = "w-full h-full";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignInForm />
    </div>
  );
}
