import "@/app/styling/global.scss";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";

export default function Home() {
  return (
    <div className="appContainer">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
