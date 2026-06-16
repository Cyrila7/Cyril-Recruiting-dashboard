import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import CareerTracker from "./components/CareerTracker";
import NeetCode from "./components/NeetCode";
import Notes from "./components/Notes";
import Links from "./components/Links";
import MoodTracker from "./components/MoodTracker";
import Reminders from "./components/Reminders";
import "./index.css";

export default function App() {
  const [active, setActive] = useState("overview");

  const pages = {
    overview: <Overview setActive={setActive} />,
    career: <CareerTracker />,
    neetcode: <NeetCode />,
    notes: <Notes />,
    links: <Links />,
    mood: <MoodTracker />,
    reminders: <Reminders />,
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} />
      <main className="main-content">{pages[active]}</main>
    </div>
  );
}
