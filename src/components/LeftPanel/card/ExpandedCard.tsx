import type { Staff } from "@/types/staff";
import { Avatar } from "../card-details/Avatar";
import { EmployeeInfo } from "../card-details/EmployeeInfo";
import { FunFactSection } from "../card-details/FunFactSection";
import { ProjectDetails } from "../card-details/ProjectDetails";
import { ProgressSection } from "../card-details/ProgressSection";

type ExpandedCardProps = {
  staff: Staff;
  showProgress?: boolean;
  isActive: boolean;
};

export default function ExpandedCard({
  staff,
  showProgress,
  isActive,
}: ExpandedCardProps) {
  return (
    <div className="card card-expanded">
      <div className="card-header">
        <div className="avatar-name">
          <Avatar
            image={staff.image}
            initials={staff.initials}
            name={staff.name}
            isActive={isActive}
          />
          <EmployeeInfo name={staff.name} role={staff.role} />
        </div>
        {!showProgress && <FunFactSection funFact={staff.fun_fact} />}
      </div>

      <ProjectDetails project={staff.current_project} />

      {showProgress && <ProgressSection timeEntry={staff.time_entries?.[0]} />}
    </div>
  );
}
