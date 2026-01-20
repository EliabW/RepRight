import { DarkModeToggle } from "@/components/features/dashboard/DarkModeToggle";
import Header from "@/components/layout/Header";

function Dashboard() {
  return (
    <>
      <Header></Header>
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
      <DarkModeToggle></DarkModeToggle>
    </>
  );
}
export default Dashboard;
