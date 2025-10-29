type FunFactSectionProps = {
  funFact?: string;
};

export function FunFactSection({ funFact }: FunFactSectionProps) {
  return (
    <div className="funFactArea">
      <div className="detail-row">
        <span className="detail-label">Fun Fact:</span>
      </div>
      <span className="funFact-value">
        {funFact || "Add fun fact to sanity!"}
      </span>
    </div>
  );
}
