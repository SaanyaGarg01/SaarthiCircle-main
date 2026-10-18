import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './context/ToastContext';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VolunteerPendingPage from './pages/auth/VolunteerPendingPage';
import NGOPendingPage from './pages/auth/NGOPendingPage';

// Layouts
import ElderlyLayout from './layouts/ElderlyLayout';
import CaregiverLayout from './layouts/CaregiverLayout';
import AdminLayout from './layouts/AdminLayout';
import NGOLayout from './layouts/NGOLayout';

// Elderly pages
import ElderlyHomePage from './pages/elderly/ElderlyHomePage';
import CompanionMatchingPage from './pages/elderly/CompanionMatchingPage';
import HelpCategoriesPage from './pages/elderly/HelpCategoriesPage';
import HelpProcessingPage from './pages/elderly/HelpProcessingPage';
import HelpStatusPage from './pages/elderly/HelpStatusPage';
import SOSPage from './pages/elderly/SOSPage';
import ChatPage from './pages/elderly/ChatPage';
import VoiceCallPage from './pages/elderly/VoiceCallPage';
import MoodCheckInPage from './pages/elderly/MoodCheckInPage';
import ProfilePage from './pages/elderly/ProfilePage';
import HealthInfoPage from './pages/elderly/HealthInfoPage';
import PreferencesPage from './pages/elderly/PreferencesPage';
import EmergencyContactsPage from './pages/elderly/EmergencyContactsPage';

// Caregiver pages
import CaregiverDashboardPage from './pages/caregiver/CaregiverDashboardPage';
import CaregiverInteractionPage from './pages/caregiver/CaregiverInteractionPage';
import SOSAlertsPage from './pages/caregiver/SOSAlertsPage';
import VolunteerProfilePage from './pages/caregiver/VolunteerProfilePage';
import VolunteerSessionPage from './pages/caregiver/VolunteerSessionPage';

// Admin pages
import AdminHomePage from './pages/admin/AdminHomePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import VolunteerApprovalPage from './pages/admin/VolunteerApprovalPage';
import NGOApprovalPage from './pages/admin/NGOApprovalPage';
import IncidentManagementPage from './pages/admin/IncidentManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AIRiskDashboardPage from './pages/admin/AIRiskDashboardPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// NGO pages
import NGODashboardPage from './pages/ngo/NGODashboardPage';
import NGOOpenRequestsPage from './pages/ngo/NGOOpenRequestsPage';
import NGOVolunteersPage from './pages/ngo/NGOVolunteersPage';
import NGOEmergencyAlertsPage from './pages/ngo/NGOEmergencyAlertsPage';
import NGOCaseHistoryPage from './pages/ngo/NGOCaseHistoryPage';
import NGOProfilePage from './pages/ngo/NGOProfilePage';

// Route guard
const RoleRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/login" replace />;
  return element;
};

const HomeRedirect = () => {
  const { isAuthenticated, userRole, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const routes = {
    elderly: '/elderly/home',
    volunteer: '/caregiver/dashboard',
    admin: '/admin/home',
    superadmin: '/admin/home',
    ngo: '/ngo/dashboard',
    volunteer_pending: '/pending-volunteer',
    ngo_pending: '/pending-ngo',
  };
  return <Navigate to={routes[userRole] || '/login'} replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route path="/" element={<HomeRedirect />} />

    {/* Auth */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/pending-volunteer" element={<VolunteerPendingPage />} />
    <Route path="/pending-ngo" element={<NGOPendingPage />} />

    {/* Elderly */}
    <Route path="/elderly" element={<RoleRoute element={<ElderlyLayout />} requiredRole="elderly" />}>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<ElderlyHomePage />} />
      <Route path="companion" element={<CompanionMatchingPage />} />
      <Route path="help" element={<HelpCategoriesPage />} />
      <Route path="help/processing" element={<HelpProcessingPage />} />
      <Route path="help/status" element={<HelpStatusPage />} />
      <Route path="sos" element={<SOSPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="voice-call" element={<VoiceCallPage />} />
      <Route path="mood" element={<MoodCheckInPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="health" element={<HealthInfoPage />} />
      <Route path="preferences" element={<PreferencesPage />} />
      <Route path="emergency-contacts" element={<EmergencyContactsPage />} />
    </Route>

    {/* Caregiver */}
    <Route path="/caregiver" element={<RoleRoute element={<CaregiverLayout />} requiredRole="volunteer" />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<CaregiverDashboardPage />} />
      <Route path="interaction" element={<CaregiverInteractionPage />} />
      <Route path="sos-alerts" element={<SOSAlertsPage />} />
      <Route path="profile" element={<VolunteerProfilePage />} />
      <Route path="session" element={<VolunteerSessionPage />} />
    </Route>

    {/* Admin */}
    <Route path="/admin" element={<RoleRoute element={<AdminLayout />} />}>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<AdminHomePage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="volunteers" element={<VolunteerApprovalPage />} />
      <Route path="ngos" element={<NGOApprovalPage />} />
      <Route path="incidents" element={<IncidentManagementPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="ai-risk" element={<AIRiskDashboardPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
    </Route>

    {/* NGO */}
    <Route path="/ngo" element={<RoleRoute element={<NGOLayout />} requiredRole="ngo" />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<NGODashboardPage />} />
      <Route path="requests" element={<NGOOpenRequestsPage />} />
      <Route path="volunteers" element={<NGOVolunteersPage />} />
      <Route path="alerts" element={<NGOEmergencyAlertsPage />} />
      <Route path="cases" element={<NGOCaseHistoryPage />} />
      <Route path="profile" element={<NGOProfilePage />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
