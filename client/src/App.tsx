import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";

// Eagerly load the home page and login for fast initial render
import Home from "./pages/Home";
import LoginPage from "./pages/Login";

// Lazy load all other pages for better performance
const NotFound = lazy(() => import("@/pages/NotFound"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const InsuranceDetail = lazy(() => import("./pages/InsuranceDetail"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const MediaPage = lazy(() => import("./pages/MediaPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const ShareholdersPage = lazy(() => import("./pages/ShareholdersPage"));
const BranchesPublicPage = lazy(() => import("./pages/Branches"));

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const HeroSlidesPage = lazy(() => import("./pages/admin/HeroSlides"));
const ContactMessagesPage = lazy(() => import("./pages/admin/ContactMessages"));
const InsuranceTypesPage = lazy(() => import("./pages/admin/InsuranceTypes"));
const StatisticsPage = lazy(() => import("./pages/admin/Statistics"));
const AdminPartnersPage = lazy(() => import("./pages/admin/Partners"));
const BranchesPage = lazy(() => import("./pages/admin/Branches"));
const NewsPage = lazy(() => import("./pages/admin/News"));
const WhyUsPage = lazy(() => import("./pages/admin/WhyUs"));
const AboutContentPage = lazy(() => import("./pages/admin/AboutContent"));
const SiteSettingsPage = lazy(() => import("./pages/admin/SiteSettings"));
const AdminPagesPage = lazy(() => import("./pages/admin/DynamicPages"));
const AdminTeamPage = lazy(() => import("./pages/admin/TeamMembers"));
const AdminMediaPage = lazy(() => import("./pages/admin/MediaItems"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#C8A23A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Login page - no navbar/footer */}
        <Route path="/login" component={LoginPage} />
        {/* Admin pages - no public navbar/footer */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/hero-slides" component={HeroSlidesPage} />
        <Route path="/admin/contacts" component={ContactMessagesPage} />
        <Route path="/admin/insurance" component={InsuranceTypesPage} />
        <Route path="/admin/statistics" component={StatisticsPage} />
        <Route path="/admin/partners" component={AdminPartnersPage} />
        <Route path="/admin/branches" component={BranchesPage} />
        <Route path="/admin/news" component={NewsPage} />
        <Route path="/admin/why-us" component={WhyUsPage} />
        <Route path="/admin/about" component={AboutContentPage} />
        <Route path="/admin/settings" component={SiteSettingsPage} />
        <Route path="/admin/pages" component={AdminPagesPage} />
        <Route path="/admin/team" component={AdminTeamPage} />
        <Route path="/admin/media" component={AdminMediaPage} />
        {/* All other pages with navbar/footer */}
        <Route>
          {() => (
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1" style={{ marginTop: "90px" }}>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path={"/"} component={Home} />
                    <Route path={"/contact"} component={Contact} />

                    {/* About section */}
                    <Route path={"/about/who-we-are"} component={AboutUs} />
                    <Route path={"/about/chairman"}>{() => <DynamicPage slug="about/chairman" />}</Route>
                    <Route path={"/about/vision"}>{() => <DynamicPage slug="about/vision" />}</Route>
                    <Route path={"/about/mission"}>{() => <DynamicPage slug="about/mission" />}</Route>
                    <Route path={"/about/goals"}>{() => <DynamicPage slug="about/goals" />}</Route>
                    <Route path={"/about/structure"}>{() => <DynamicPage slug="about/structure" />}</Route>
                    <Route path={"/about/team"} component={TeamPage} />
                    <Route path={"/about/privacy"}>{() => <DynamicPage slug="about/privacy" />}</Route>
                    <Route path={"/about/cookies"}>{() => <DynamicPage slug="about/cookies" />}</Route>

                    {/* Insurance types */}
                    <Route path={"/insurance/:slug"}>{(params) => <InsuranceDetail slug={params.slug} />}</Route>

                    {/* Partners section */}
                    <Route path={"/partners/reinsurers"}>{() => <PartnersPage category="reinsurer" />}</Route>
                    <Route path={"/partners/brokers"}>{() => <PartnersPage category="broker" />}</Route>
                    <Route path={"/partners/shareholders"}>{() => <ShareholdersPage />}</Route>
                    <Route path={"/partners/success"}>{() => <DynamicPage slug="partners/success" />}</Route>

                    {/* Media section */}
                    <Route path={"/media/photos"}>{() => <MediaPage type="photo" />}</Route>
                    <Route path={"/media/videos"}>{() => <MediaPage type="video" />}</Route>
                    <Route path={"/media/conferences"}>{() => <MediaPage type="conference" />}</Route>
                    <Route path={"/media/events"}>{() => <MediaPage type="event" />}</Route>
                    <Route path={"/media/news"}>{() => <DynamicPage slug="media/news" />}</Route>

                    {/* Branches */}
                    <Route path={"/about/branches"} component={BranchesPublicPage} />

                    {/* Fallback */}
                    <Route path={"/404"} component={NotFound} />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          )}
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
