import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import InsuranceDetail from "./pages/InsuranceDetail";
import DynamicPage from "./pages/DynamicPage";
import TeamPage from "./pages/TeamPage";
import MediaPage from "./pages/MediaPage";
import PartnersPage from "./pages/PartnersPage";
import AdminDashboard from "./pages/admin/Dashboard";
import HeroSlidesPage from "./pages/admin/HeroSlides";
import ContactMessagesPage from "./pages/admin/ContactMessages";
import InsuranceTypesPage from "./pages/admin/InsuranceTypes";
import StatisticsPage from "./pages/admin/Statistics";
import AdminPartnersPage from "./pages/admin/Partners";
import BranchesPage from "./pages/admin/Branches";
import NewsPage from "./pages/admin/News";
import WhyUsPage from "./pages/admin/WhyUs";
import AboutContentPage from "./pages/admin/AboutContent";
import SiteSettingsPage from "./pages/admin/SiteSettings";
import LoginPage from "./pages/Login";
import AdminPagesPage from "./pages/admin/DynamicPages";
import AdminTeamPage from "./pages/admin/TeamMembers";
import AdminMediaPage from "./pages/admin/MediaItems";

function Router() {
  return (
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
                <Route path={"/insurance/health"}>{() => <InsuranceDetail type="health" />}</Route>
                <Route path={"/insurance/car"}>{() => <InsuranceDetail type="car" />}</Route>
                <Route path={"/insurance/marine"}>{() => <InsuranceDetail type="marine" />}</Route>
                <Route path={"/insurance/engineering"}>{() => <InsuranceDetail type="engineering" />}</Route>
                <Route path={"/insurance/energy"}>{() => <InsuranceDetail type="energy" />}</Route>
                <Route path={"/insurance/takaful"}>{() => <InsuranceDetail type="takaful" />}</Route>

                {/* Partners section */}
                <Route path={"/partners/reinsurers"}>{() => <PartnersPage category="reinsurer" />}</Route>
                <Route path={"/partners/brokers"}>{() => <PartnersPage category="broker" />}</Route>
                <Route path={"/partners/success"}>{() => <DynamicPage slug="partners/success" />}</Route>

                {/* Media section */}
                <Route path={"/media/photos"}>{() => <MediaPage type="photo" />}</Route>
                <Route path={"/media/videos"}>{() => <MediaPage type="video" />}</Route>
                <Route path={"/media/conferences"}>{() => <MediaPage type="conference" />}</Route>
                <Route path={"/media/events"}>{() => <MediaPage type="event" />}</Route>
                <Route path={"/media/news"}>{() => <DynamicPage slug="media/news" />}</Route>

                {/* Fallback */}
                <Route path={"/404"} component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
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
