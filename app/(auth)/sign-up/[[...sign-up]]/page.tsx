import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <AnimatedBackground />
      <div className="flex h-screen items-center justify-center flex-col p-10">
        <SignUp forceRedirectUrl={"/onboarding"} />
      </div>
    </>
  );
}
