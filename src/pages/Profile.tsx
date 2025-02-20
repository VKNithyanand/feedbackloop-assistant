
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  username: string;
  avatar_url: string | null;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setUsername(data.username || "");
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          
          <Button onClick={updateProfile}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
