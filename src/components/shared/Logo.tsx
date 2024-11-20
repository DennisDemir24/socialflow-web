interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Flow lines */}
      <path
        d="M8 16C8 11.582 11.582 8 16 8M16 24C20.418 24 24 20.418 24 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Connection nodes */}
      <circle cx="16" cy="8" r="2" fill="white" />
      <circle cx="24" cy="16" r="2" fill="white" />
      <circle cx="16" cy="24" r="2" fill="white" />
      <circle cx="8" cy="16" r="2" fill="white" />
      
      {/* Center dot */}
      <circle cx="16" cy="16" r="3" fill="white" />
      
      {/* Flow arrows */}
      <path
        d="M19 15.5L22 16M13 16.5L10 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
