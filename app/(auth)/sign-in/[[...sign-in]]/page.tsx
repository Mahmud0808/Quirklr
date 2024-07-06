import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <AnimatedBackground />
      <div className="flex h-screen items-center justify-center flex-col p-10">
        <SignIn />
      </div>
    </div>
  );
}
