"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Trophy, Star } from "lucide-react";
import { getMockLeaderboardData } from "@/lib/audit";
import { LeaderboardEntry } from "@/lib/types";

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const data = getMockLeaderboardData();
    setLeaderboardData(data);
  }, []);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-primary/50" />;
    }
  };
  
  return (
    <section id="leaderboard" className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Auditor Leaderboard</h2>
        <p className="text-muted-foreground mt-2">
          Top performing security auditors this month
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Top Auditors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-muted-foreground text-sm">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Auditor</th>
                  <th className="text-center py-3 px-4">Audits</th>
                  <th className="text-center py-3 px-4">Issues Found</th>
                  <th className="text-center py-3 px-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="font-medium">{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={entry.avatar} alt={entry.username} />
                          <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{entry.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{entry.auditsCompleted}</td>
                    <td className="py-3 px-4 text-center">{entry.issuesFound}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1 font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {entry.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}