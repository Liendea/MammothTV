import type { Staff } from "../../types/staff";
import ExpandedCard from "./ExpandedCard";
import SimpleCard from "./SimpleCard";

type StaffCardProps = {
  staff: Staff;
  isExpanded?: boolean;
  showProgress?: boolean;
  isActive: boolean;
};

export default function StaffCard({
  staff,
  isExpanded = false,
  isActive,
  showProgress,
}: StaffCardProps) {
  if (isExpanded) {
    return (
      <ExpandedCard
        staff={staff}
        showProgress={showProgress}
        isActive={isActive}
      />
    );
  }

  return <SimpleCard staff={staff} isActive={isActive} />;
}
