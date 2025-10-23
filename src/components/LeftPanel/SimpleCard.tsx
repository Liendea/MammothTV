import Image from "next/image";
import type { Staff } from "../../types/staff";
import "@/app/styling/staffSection.scss";

type SimpleCardProps = {
  staff: Staff;
};

export default function SimpleCard({ staff }: SimpleCardProps) {
  return (
    <div className="card card-simple">
      <div className="card-contaienr">
        <div className="card-header">
          <div className={`avatar ${staff.image ? "has-img" : ""}`}>
            {staff.image ? (
              <Image
                src={staff.image}
                alt={staff.name}
                width={65}
                height={65}
                className="avtar-image"
                style={{
                  borderRadius: "50%",
                  objectFit: "fill",
                }}
              />
            ) : (
              staff.initials
            )}
          </div>
          <div className="employee-info">
            <div className="employee-name">{staff.name}</div>
            <div className="project-name">
              {staff.current_project?.name || "AWOL"}
            </div>
            <span className="role">{staff.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
