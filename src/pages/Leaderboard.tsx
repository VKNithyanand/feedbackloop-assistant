
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Award, Medal } from "lucide-react";

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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Award className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold">{index + 1}</span>;
    }
  };

  const getCardStyles = (index: number) => {
    switch (index) {
      case 0:
        return "border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case 1:
        return "border-2 border-gray-400 bg-gray-50 dark:bg-gray-900/10";
      case 2:
        return "border-2 border-amber-600 bg-amber-50 dark:bg-amber-900/10";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {scores.map((entry, index) => (
            <Card 
              key={index} 
              className={`p-4 transition-all hover:scale-[1.01] ${getCardStyles(index)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="font-semibold">{entry.username}</div>
                    <div className="text-sm text-muted-foreground capitalize">{entry.domain}</div>
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
};
