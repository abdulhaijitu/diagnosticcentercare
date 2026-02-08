import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTest from "./pages/BookTest";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import MyRequests from "./pages/MyRequests";
import Dashboard from "./pages/Dashboard";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Tests from "./pages/Tests";
import TestDetail from "./pages/TestDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useLanguageDirection();
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16 lg:pb-0">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book-test" element={<BookTest />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/:slug" element={<TestDetail />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <MobileBottomNav />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
