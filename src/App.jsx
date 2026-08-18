import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";
import { SalonProvider } from "./lib/SalonContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireSalon from "./components/RequireSalon.jsx";
import RedirectIfAuthed from "./components/RedirectIfAuthed.jsx";
import RootRedirect from "./components/RootRedirect.jsx";
import AppShell from "./components/layout/AppShell.jsx";

import Login from "./screens/auth/Login.jsx";
import SignUp from "./screens/auth/SignUp.jsx";

import Dashboard from "./screens/Dashboard.jsx";
import Leads from "./screens/Leads.jsx";
import ConversationsList from "./screens/ConversationsList.jsx";
import Conversations from "./screens/Conversations.jsx";
import Opportunities from "./screens/Opportunities.jsx";
import More from "./screens/More.jsx";
import EditSalon from "./screens/EditSalon.jsx";

import StepSalonInfo from "./screens/onboarding/StepSalonInfo.jsx";
import StepServices from "./screens/onboarding/StepServices.jsx";
import StepBusinessInfo from "./screens/onboarding/StepBusinessInfo.jsx";
import StepHours from "./screens/onboarding/StepHours.jsx";
import StepNotifications from "./screens/onboarding/StepNotifications.jsx";
import StepConnectChannels from "./screens/onboarding/StepConnectChannels.jsx";
import OnboardingComplete from "./screens/onboarding/OnboardingComplete.jsx";

function WithShell({ children }) {
  return (
    <RequireAuth>
      <RequireSalon>
        <AppShell>{children}</AppShell>
      </RequireSalon>
    </RequireAuth>
  );
}

function WithOnboarding({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <AuthProvider>
        <SalonProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <Login />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectIfAuthed>
                  <SignUp />
                </RedirectIfAuthed>
              }
            />

            <Route
              path="/onboarding/salon-info"
              element={
                <WithOnboarding>
                  <StepSalonInfo />
                </WithOnboarding>
              }
            />
            <Route
              path="/onboarding/services"
              element={
                <WithOnboarding>
                  <StepServices />
                </WithOnboarding>
              }
            />
            <Route
              path="/onboarding/business-info"
              element={
                <WithOnboarding>
                  <StepBusinessInfo />
                </WithOnboarding>
              }
            />
            {/* Legacy onboarding screens: kept and still reachable, but no
                longer part of the mandatory first-run sequence (Hours has no
                matching DB table, and Connect Channels covers
                Instagram/WhatsApp integration which is a later stage). */}
            <Route
              path="/onboarding/hours"
              element={
                <WithOnboarding>
                  <StepHours />
                </WithOnboarding>
              }
            />
            <Route
              path="/onboarding/notifications"
              element={
                <WithOnboarding>
                  <StepNotifications />
                </WithOnboarding>
              }
            />
            <Route
              path="/onboarding/connect"
              element={
                <WithOnboarding>
                  <StepConnectChannels />
                </WithOnboarding>
              }
            />
            <Route
              path="/onboarding/complete"
              element={
                <WithOnboarding>
                  <OnboardingComplete />
                </WithOnboarding>
              }
            />

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
                  <ConversationsList />
                </WithShell>
              }
            />
            <Route
              path="/conversations/:leadId"
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
            <Route
              path="/salon-settings"
              element={
                <WithShell>
                  <EditSalon />
                </WithShell>
              }
            />

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </SalonProvider>
      </AuthProvider>
    </BrowserRouter>
    </LanguageProvider>
  );
}
