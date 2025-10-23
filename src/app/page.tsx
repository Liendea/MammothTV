import "@/app/styling/global.scss";
import StaffSection from "@/components/LeftPanel/StaffSection";
import ProjectBudget from "@/components/RightPanel/ProjectSection";
import Footer from "@/components/RightPanel/Footer";

export default async function Home() {
  return (
    <>
      <main>
        <div className="dashboard">
          <aside className="left-panel">
            <StaffSection />
          </aside>

          <aside className="right-panel">
            <ProjectBudget />
            <Footer />
          </aside>
        </div>
      </main>
    </>
  );
}
