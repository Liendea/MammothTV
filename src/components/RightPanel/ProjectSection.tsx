import "@/app/styling/projectSection.scss";
import ProgressBar from "./ProgressBar";

export default function ProjectSection() {
  return (
    <section className="projectSection">
      <div className="header">
        <h1>Project budget</h1>
      </div>
      <hr />

      <ProgressBar progress={50} />
      <ProgressBar progress={20} />
      <ProgressBar progress={150} />
      <ProgressBar progress={65} />

      <hr />
    </section>
  );
}
