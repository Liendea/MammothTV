import "@/app/styling/footer.scss";

import Image from "next/image";

export default function Footer() {
  return (
    <div className="footerSection">
      <div className="tiny-text">
        <p>MammothTV 2025</p>
        <p>Copyright © 2025 Woolly Mammoth</p>
      </div>

      <Image
        src={"/images/logo.svg"}
        alt="logo"
        width={500}
        height={100}
        className="logo"
      />
    </div>
  );
}
