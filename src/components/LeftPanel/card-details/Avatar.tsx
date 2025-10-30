import Image from "next/image";

type AvatarProps = {
  image?: string;
  initials: string;
  name: string;
  isActive: boolean;
};

export function Avatar({ image, initials, name, isActive }: AvatarProps) {
  const hasImage = !!image;

  return (
    <div
      className={`avatar ${hasImage ? "has-img" : ""} ${isActive ? "active" : "inactive"}`}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className="avatar-image"
        />
      ) : (
        <div className="avatar-inner">{initials}</div>
      )}
    </div>
  );
}
