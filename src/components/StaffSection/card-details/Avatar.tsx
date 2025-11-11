import Image from "next/image";
import { motion } from "framer-motion";

type AvatarProps = {
  image?: string;
  initials: string;
  name: string;
  isActive: boolean;
  isExpanded: boolean;
};

export function Avatar({
  image,
  initials,
  name,
  isActive,
  isExpanded,
}: AvatarProps) {
  const hasImage = !!image;

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 2, ease: "easeInOut" },
      }}
      className={`avatar ${hasImage ? "has-img" : ""} ${isActive ? "active" : "inactive"}`}
      style={{
        width: isExpanded ? undefined : "12vh",
        height: isExpanded ? undefined : "12vh",
      }}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={140}
          height={140}
          className="avatar-image"
        />
      ) : (
        <div className="avatar-inner">{initials}</div>
      )}
    </motion.div>
  );
}
