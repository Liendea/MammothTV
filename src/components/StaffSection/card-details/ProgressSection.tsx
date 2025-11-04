type TimeEntry = {
  hours_today: number;
};

type ProgressSectionProps = {
  timeEntry?: TimeEntry;
};

export function ProgressSection({ timeEntry }: ProgressSectionProps) {
  const hoursToday = timeEntry?.hours_today ?? 0;
  const progressPercentage = (hoursToday / 7) * 100;

  return (
    <>
      <div className="detail-row">
        <span className="detail-label">HOURS TODAY</span>
        <span className="detail-value badge">{hoursToday}h</span>
      </div>
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
