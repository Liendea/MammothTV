type TimeEntry = {
  hours_today: number;
};

type ProgressSectionProps = {
  timeEntry?: TimeEntry;
};

export function ProgressSection({ timeEntry }: ProgressSectionProps) {
  const hoursDecimal = timeEntry?.hours_today ?? 0;

  // Beräkna timmar och minuter från decimaltalet
  const hours = Math.floor(hoursDecimal);
  const minutes = Math.round((hoursDecimal - hours) * 60);

  // Formatera strängen (visar bara minuter om det finns några, eller bara "0h" om det är tomt)
  const formattedTime = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

  // Framsteg baserat på en 7-timmars arbetsdag
  const progressPercentage = Math.min((hoursDecimal / 7) * 100, 100);

  return (
    <>
      <div className="detail-row">
        <span className="detail-label">HOURS TODAY</span>
        <span className="detail-value badge">{formattedTime}</span>
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
