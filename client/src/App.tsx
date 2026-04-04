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
import AdminDashboard from "./pages/admin/Dashboard";
import HeroSlidesPage from "./pages/admin/HeroSlides";
import ContactMessagesPage from "./pages/admin/ContactMessages";
import InsuranceTypesPage from "./pages/admin/InsuranceTypes";
import StatisticsPage from "./pages/admin/Statistics";
import PartnersPage from "./pages/admin/Partners";
import BranchesPage from "./pages/admin/Branches";
import NewsPage from "./pages/admin/News";
import WhyUsPage from "./pages/admin/WhyUs";
import AboutContentPage from "./pages/admin/AboutContent";
import SiteSettingsPage from "./pages/admin/SiteSettings";
import LoginPage from "./pages/Login";

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
      <Route path="/admin/partners" component={PartnersPage} />
      <Route path="/admin/branches" component={BranchesPage} />
      <Route path="/admin/news" component={NewsPage} />
      <Route path="/admin/why-us" component={WhyUsPage} />
      <Route path="/admin/about" component={AboutContentPage} />
      <Route path="/admin/settings" component={SiteSettingsPage} />
      {/* All other pages with navbar/footer */}
      <Route>
        {() => (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1" style={{ marginTop: "90px" }}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/about/who-we-are"} component={AboutUs} />
          <Route path={"/insurance/health"}>{() => <InsuranceDetail type="health" />}</Route>
          <Route path={"/insurance/car"}>{() => <InsuranceDetail type="car" />}</Route>
          <Route path={"/insurance/marine"}>{() => <InsuranceDetail type="marine" />}</Route>
          <Route path={"/insurance/engineering"}>{() => <InsuranceDetail type="engineering" />}</Route>
          <Route path={"/insurance/energy"}>{() => <InsuranceDetail type="energy" />}</Route>
          <Route path={"/insurance/takaful"}>{() => <InsuranceDetail type="takaful" />}</Route>
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
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
