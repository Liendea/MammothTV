import Image from "next/image";

export default function Footer() {
  return (
    <div className="footerSection">
      <div className="tiny-text">
        {/* insert text here eg copyrights or something*/}
      </div>

      <Image
        src={"/images/logo.svg"}
        alt="logo"
        width={500}
        height={100}
        className="logo"
        priority
      />
    </div>
  );
}
