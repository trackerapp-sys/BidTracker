import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Auctions from "@/pages/auctions";
import SelectAuctionType from "@/pages/select-auction-type";
import CreateIndividual from "@/pages/create-individual";
import CreateLiveFeed from "@/pages/create-live-feed";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import { useState } from "react";

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
    </Switch>
  );
}

export default function App() {
  // TODO: Replace with actual auth state
  const [isAuthenticated] = useState(true);
  const [user] = useState({ name: "John Doe", avatar: "" });

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Login />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <Avatar className="h-9 w-9" data-testid="avatar-user">
                    <AvatarFallback>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
