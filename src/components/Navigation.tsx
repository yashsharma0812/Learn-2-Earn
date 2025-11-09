import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, BookOpen, Gift, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out",
    });
    navigate("/");
  };

  const navItems = user
    ? [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/modules", icon: BookOpen, label: "Modules" },
        { to: "/rewards", icon: Gift, label: "Rewards" },
        { to: "/profile", icon: User, label: "Profile" },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 mr-8">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Learn2Earn
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
