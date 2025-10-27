import type { Staff } from "../../types/staff";
import ExpandedCard from "./ExpandedCard";
import SimpleCard from "./SimpleCard";

type StaffCardProps = {
  staff: Staff;
  isExpanded?: boolean;
  showProgress?: boolean;
};

export default function StaffCard({
  staff,
  isExpanded = false,
  showProgress,
}: StaffCardProps) {
  if (isExpanded) {
    return <ExpandedCard staff={staff} showProgress={showProgress} />;
  }

  return <SimpleCard staff={staff} />;
}
