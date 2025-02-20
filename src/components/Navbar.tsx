
import { useNavigate } from "react-router-dom";
import { Home, Video, Trophy, LogOut, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="h-5 w-5 mr-2" />
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate("/video-interview")}>
            <Video className="h-5 w-5 mr-2" />
            Video Interview
          </Button>
          <Button variant="ghost" onClick={() => navigate("/leaderboard")}>
            <Trophy className="h-5 w-5 mr-2" />
            Leaderboard
          </Button>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
