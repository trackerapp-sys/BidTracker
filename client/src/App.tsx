import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Auctions from "@/pages/auctions";
import SelectAuctionType from "@/pages/select-auction-type";
import CreateIndividual from "@/pages/create-individual";
import CreateLiveFeed from "@/pages/create-live-feed";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import { AuthProvider, useAuth } from "@/contexts/auth";
import { LogOut } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auctions" component={Auctions} />
      <Route path="/create" component={SelectAuctionType} />
      <Route path="/create/individual" component={CreateIndividual} />
      <Route path="/create/live-feed" component={CreateLiveFeed} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
    </Switch>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Avatar className="h-9 w-9" data-testid="avatar-user">
                <AvatarFallback>
                  {user?.name ? user.name.split(" ").map(n => n[0]).join("") : user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <ErrorBoundary>
              <Router />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
