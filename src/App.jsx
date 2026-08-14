import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Leads from "./screens/Leads.jsx";
import Conversations from "./screens/Conversations.jsx";
import Opportunities from "./screens/Opportunities.jsx";
import More from "./screens/More.jsx";
import StepSalonInfo from "./screens/onboarding/StepSalonInfo.jsx";
import StepServices from "./screens/onboarding/StepServices.jsx";
import StepHours from "./screens/onboarding/StepHours.jsx";
import StepNotifications from "./screens/onboarding/StepNotifications.jsx";
import StepConnectChannels from "./screens/onboarding/StepConnectChannels.jsx";
import OnboardingComplete from "./screens/onboarding/OnboardingComplete.jsx";

function WithShell({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/salon-info" replace />} />

        <Route path="/onboarding/salon-info" element={<StepSalonInfo />} />
        <Route path="/onboarding/services" element={<StepServices />} />
        <Route path="/onboarding/hours" element={<StepHours />} />
        <Route path="/onboarding/notifications" element={<StepNotifications />} />
        <Route path="/onboarding/connect" element={<StepConnectChannels />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />

        <Route
          path="/dashboard"
          element={
            <WithShell>
              <Dashboard />
            </WithShell>
          }
        />
        <Route
          path="/leads"
          element={
            <WithShell>
              <Leads />
            </WithShell>
          }
        />
        <Route
          path="/conversations"
          element={
            <WithShell>
              <Conversations />
            </WithShell>
          }
        />
        <Route
          path="/opportunities"
          element={
            <WithShell>
              <Opportunities />
            </WithShell>
          }
        />
        <Route
          path="/more"
          element={
            <WithShell>
              <More />
            </WithShell>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
