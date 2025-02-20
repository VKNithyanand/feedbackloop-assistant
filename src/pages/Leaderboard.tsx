
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type LeaderboardEntry = {
  username: string;
  domain: string;
  score: number;
  created_at: string;
};

export default function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          score,
          domain,
          created_at,
          profiles (username)
        `)
        .order('score', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching scores:', error);
        return;
      }

      setScores(data.map((entry: any) => ({
        username: entry.profiles.username,
        domain: entry.domain,
        score: entry.score,
        created_at: entry.created_at,
      })));
      setLoading(false);
    };

    fetchScores();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {scores.map((entry, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold">{index + 1}</div>
                  <div>
                    <div className="font-semibold">{entry.username}</div>
                    <div className="text-sm text-muted-foreground">{entry.domain}</div>
                  </div>
                </div>
                <div className="text-xl font-bold">{entry.score}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
