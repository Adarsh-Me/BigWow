import Image from "next/image";

export default function Logo() {
  return (
    <Image
      className="dark:invert"
      src="/icon.svg"
      alt="Big Wow"
      width={24}
      height={24}
    />
  );
}
