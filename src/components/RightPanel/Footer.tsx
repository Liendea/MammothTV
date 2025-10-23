import "@/app/styling/footer.scss";

import Image from "next/image";

export default function Footer() {
  return (
    <Image
      src={"/images/logo.svg"}
      alt="logo"
      width={400}
      height={400}
      className="logo"
    />
  );
}
