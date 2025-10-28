import Image from "next/image";
import type { Staff } from "../../types/staff";

type SimpleCardProps = {
  staff: Staff;
  isActive: boolean;
};

export default function SimpleCard({ staff, isActive }: SimpleCardProps) {
  const hasImage = staff.image;

  return (
    <div className="card card-simple">
      <div className="card-container">
        <div className="card-header">
          <div
            className={`avatar ${hasImage ? "has-img" : ""} ${isActive ? "active" : "inactive"}`}
          >
            {staff.image ? (
              <Image
                src={staff.image}
                alt={staff.name}
                width={100}
                height={100}
                className="avatar-image"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              staff.initials
            )}
          </div>
          <div className="employee-info">
            <div className="employee-name">{staff.name}</div>
            <div className="project-name">
              {staff.current_project?.name || "Not tracking time"}
            </div>
            <span className="role">{staff.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
