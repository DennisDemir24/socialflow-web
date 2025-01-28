import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-8 h-8 bg-[#5B45FF] rounded-lg overflow-hidden">
        <div className="flex flex-col items-center -space-y-0.5">
          <div className="flex space-x-0.5">
            <span className="h-1.5 w-1.5 rounded-sm bg-white/90"></span>
            <span className="h-1.5 w-1.5 rounded-sm bg-white/60"></span>
          </div>
          <div className="flex space-x-0.5">
            <span className="h-1.5 w-1.5 rounded-sm bg-white/30"></span>
            <span className="h-1.5 w-1.5 rounded-sm bg-white/90"></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
