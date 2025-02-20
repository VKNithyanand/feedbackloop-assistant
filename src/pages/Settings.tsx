
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex flex-col items-center justify-center p-4 h-auto"
            >
              <Sun className="h-6 w-6 mb-2" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex flex-col items-center justify-center p-4 h-auto"
            >
              <Moon className="h-6 w-6 mb-2" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              className="flex flex-col items-center justify-center p-4 h-auto"
            >
              <Monitor className="h-6 w-6 mb-2" />
              <span>System</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
