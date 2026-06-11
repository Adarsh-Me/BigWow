import Image from "next/image";

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
}

export default function Logo({ variant = "icon", className }: LogoProps) {
  if (variant === "full") {
    return (
      <div className={className}>
        {/* Light theme logo (for white/light background) */}
        <Image
          src="/logo-light.png?v=2"
          alt="BigWow"
          width={96}
          height={32}
          className="block dark:hidden h-8 w-auto object-contain"
          priority
        />
        {/* Dark theme logo (for black/dark background) */}
        <Image
          src="/logo-dark.png?v=2"
          alt="BigWow"
          width={96}
          height={32}
          className="hidden dark:block h-8 w-auto object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <Image
      className="dark:invert"
      src="/icon.svg?v=2"
      alt="BigWow"
      width={24}
      height={24}
    />
  );
}

