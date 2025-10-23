import "@/app/styling/projectSection.scss";
import ProgressBar from "./ProgressBar";

export default function ProjectSection() {
  return (
    <section className="projectSection">
      <div className="header">
        <h1>Project budget</h1>
      </div>
      <hr />
      <div className="budget-wrapper">
        <ProgressBar
          progress={60}
          projectName="This is a very long ProjectName - it need to be truncated"
        />
        <ProgressBar progress={45} projectName="ProjectName" />
        <ProgressBar progress={110} projectName="ProjectName" />
        <ProgressBar progress={15} projectName="ProjectName" />
      </div>
      <hr />
    </section>
  );
}
