import type { Staff } from "@/types/staff";
import { Avatar } from "../card-details/Avatar";
import { SimpleCardInfo } from "../card-details/SimpleCardInfo";

type SimpleCardProps = {
  staff: Staff;
  isActive: boolean;
};

export default function SimpleCard({ staff, isActive }: SimpleCardProps) {
  return (
    <div className="card card-simple">
      <div className="card-container">
        <div className="card-header">
          <Avatar
            image={staff.image}
            initials={staff.initials}
            name={staff.name}
            isActive={isActive}
          />
          <SimpleCardInfo
            name={staff.name}
            role={staff.role}
            projectName={staff.current_project?.name}
          />
        </div>
      </div>
    </div>
  );
}
