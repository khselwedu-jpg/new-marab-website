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

function Router() {
  return (
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
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

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
