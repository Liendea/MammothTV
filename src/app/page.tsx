import StaffSection from "@/components/StaffSection/StaffSection";
import ProjectBudget from "@/components/ProjectBudgetSection/ProjectSection";
import Footer from "@/components/ProjectBudgetSection/Footer";

export default async function Home() {
  return (
    <main className="dashboard">
      <aside className="left-panel">
        <StaffSection />
      </aside>

      <aside className="right-panel">
        <ProjectBudget />
        <Footer />
      </aside>
    </main>
  );
}
