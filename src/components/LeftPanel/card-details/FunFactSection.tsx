type FunFactSectionProps = {
  funFact?: string;
};

export function FunFactSection({ funFact }: FunFactSectionProps) {
  return (
    <>
      <span className="fun-fact-label">Fun Fact:</span>
      <span className="fun-fact-value">
        {funFact || "Add fun fact to sanity!"}
      </span>
    </>
  );
}
