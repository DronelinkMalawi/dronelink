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
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
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
import TeamsPage from "./pages/TeamsPage";
import AdminDashboard from "./components/admin/AdminDashboard";
// TODO: Build later - Team, Analytics, Settings, Portfolio, Authors
// import TeamManagement from "./components/admin/TeamManagement";
import BlogManagement from "./components/admin/BlogManagement";
// import Analytics from "./components/admin/Analytics";
// import Settings from "./components/admin/Settings";
// import PortfolioManagement from "./components/admin/PortfolioManagement";
// import AuthorManagement from "./components/admin/AuthorManagement";
import ImageManagement from "./components/admin/ImageManagement";
import SkipToContent from "@/components/SkipToContent";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { TeamProvider } from "./contexts/TeamContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SupabaseTest from "./components/SupabaseTest";

const queryClient = new QueryClient();

const App = () => (
  <>
    <SkipToContent />
    <main id="main" className="min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
<Route path="/contact" element={<Contact />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/team" element={<TeamsPage />} />
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
{/* Consultation and contact routes redirect to contact section */}
        <Route path="/consultation" element={<Contact />} />
        <Route path="/free-consultation" element={<Contact />} />
        <Route path="/contacts" element={<Contact />} />
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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/test-supabase" element={<SupabaseTest />} />
<Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="images" element={<ImageManagement />} />
          {/* TODO: Build later - Portfolio, Team, Authors, Analytics, Settings */}
          {/* <Route path="portfolio" element={<PortfolioManagement />} /> */}
          {/* <Route path="team" element={<TeamManagement />} /> */}
          {/* <Route path="authors" element={<AuthorManagement />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
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
        <TeamProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TeamProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default Root;
