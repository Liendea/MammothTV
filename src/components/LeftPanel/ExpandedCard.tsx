import Image from "next/image";
import type { Staff } from "../../types/staff";
import "@/app/styling/staffSection.scss";

type ExpandedCardProps = {
  staff: Staff;
  showProgress?: boolean;
};

export default function ExpandedCard({
  staff,
  showProgress,
}: ExpandedCardProps) {
  return (
    <div className="card card-expanded">
      <div className="card-header">
        <div className={`avatar ${staff.image ? "has-img" : ""}`}>
          {staff.image ? (
            <Image
              src={staff.image!}
              alt={staff.name}
              width={64}
              height={64}
              className="avtar-image"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            staff.initials
          )}
        </div>

        <div className="employee-info">
          <div className="employee-name">{staff.name}</div>
          <div className="employee-role">{staff.role}</div>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">PROJECT</span>
          <span className="detail-value">
            {staff.current_project?.name || "Not tracking time"}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">CLIENT</span>
          <span className="detail-value">
            {staff.current_project?.client || "Not tracking time"}
          </span>
        </div>
      </div>

      {/* Progress bar visas endast om showProgress=true */}
      {showProgress && (
        <div className="toggleArea">
          <div className="detail-row">
            <span className="detail-label">HOURS TODAY</span>
            <span className="detail-value badge">
              {staff.time_entries?.[0]?.hours_today}h
            </span>
          </div>
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((staff.time_entries?.[0]?.hours_today ?? 0) / 7) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
