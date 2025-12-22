import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AerialImagery from "./pages/AerialImagery";
import GISMapping from "./pages/GISMapping";
import PrecisionAgriculture from "./pages/PrecisionAgriculture";
import LandHealthMonitoring from "./pages/LandHealthMonitoring";
import GetQuote from "./pages/GetQuote";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/OurStory";
import OpenPositions from "./pages/OpenPositions";
import SubmitResume from "./pages/SubmitResume";
import CaseStudies from "./pages/CaseStudies";
import DiscussProject from "./pages/DiscussProject";
import EmergencyContact from "./pages/EmergencyContact";
import Portfolio from "./pages/Portfolio";
import Demo from "./pages/Demo";
import Consultation from "./pages/Consultation";
import FreeConsultation from "./pages/FreeConsultation";
import StartMonitoring from "./pages/StartMonitoring";
import ViewResults from "./pages/ViewResults";
import ViewReports from "./pages/ViewReports";
import StartProject from "./pages/StartProject";
import ResearchCollaboration from "./pages/ResearchCollaboration";
import ScheduleAssessment from "./pages/ScheduleAssessment";
import DownloadBrochure from "./pages/DownloadBrochure";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AerialImagery from "./pages/AerialImagery";
import GISMapping from "./pages/GISMapping";
import PrecisionAgriculture from "./pages/PrecisionAgriculture";
import LandHealthMonitoring from "./pages/LandHealthMonitoring";
import GetQuote from "./pages/GetQuote";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/OurStory";
import OpenPositions from "./pages/OpenPositions";
import SubmitResume from "./pages/SubmitResume";
import CaseStudies from "./pages/CaseStudies";
import DiscussProject from "./pages/DiscussProject";
import EmergencyContact from "./pages/EmergencyContact";
import Portfolio from "./pages/Portfolio";
import Demo from "./pages/Demo";
import Consultation from "./pages/Consultation";
import FreeConsultation from "./pages/FreeConsultation";
import StartMonitoring from "./pages/StartMonitoring";
import ViewResults from "./pages/ViewResults";
import ViewReports from "./pages/ViewReports";
import StartProject from "./pages/StartProject";
import ResearchCollaboration from "./pages/ResearchCollaboration";
import ScheduleAssessment from "./pages/ScheduleAssessment";
import DownloadBrochure from "./pages/DownloadBrochure";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import PartnersSection from "./components/PartnersSection";
import AdminDashboard from "./pages/AdminDashboard";
import TeamManagement from "./components/admin/TeamManagement";
import BlogManagement from "./components/admin/BlogManagement";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import SkipToContent from "@/components/SkipToContent";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <>
    <SkipToContent />
    <main id="main" className="min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/partnerssection" element={<PartnersSection />} />
        <Route path="/services/aerial-imagery" element={<AerialImagery />} />
        <Route path="/services/gis-mapping" element={<GISMapping />} />
        <Route path="/services/precision-agriculture" element={<PrecisionAgriculture />} />
        <Route path="/services/land-health-monitoring" element={<LandHealthMonitoring />} />
        <Route path="/get-quote" element={<GetQuote />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/open-positions" element={<OpenPositions />} />
        <Route path="/submit-resume" element={<SubmitResume />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/discuss-project" element={<DiscussProject />} />
        <Route path="/emergency-contact" element={<EmergencyContact />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/free-consultation" element={<FreeConsultation />} />
        <Route path="/start-monitoring" element={<StartMonitoring />} />
        <Route path="/view-results" element={<ViewResults />} />
        <Route path="/view-reports" element={<ViewReports />} />
        <Route path="/start-project" element={<StartProject />} />
        <Route path="/research-collaboration" element={<ResearchCollaboration />} />
        <Route path="/schedule-assessment" element={<ScheduleAssessment />} />
        <Route path="/download-brochure" element={<DownloadBrochure />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </>
);

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default Root;
