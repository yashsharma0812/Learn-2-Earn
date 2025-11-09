import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Gift, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useAuth();
  const [completedModules, setCompletedModules] = useState<any[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for now
    setCompletedModules([]);
    setRedeemedVouchers([]);
  }, []);



  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="shadow-primary mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">{user?.username}</CardTitle>
                <CardDescription className="text-base">
                  {user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-accent/10">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  {user?.points || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{completedModules.length}</div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/10">
                <Gift className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold">{redeemedVouchers.length}</div>
                <div className="text-sm text-muted-foreground">Rewards Redeemed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Completed Modules */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Completed Modules
              </CardTitle>
              <CardDescription>Your learning achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {completedModules.length > 0 ? (
                <div className="space-y-4">
                  {completedModules.map((progress) => (
                    <div
                      key={progress.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{progress.modules.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            +{progress.modules.points_reward} pts
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(progress.completed_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No completed modules yet</p>
                  <p className="text-sm">Start learning to see your progress here!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Redeemed Vouchers */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-accent" />
                Redeemed Rewards
              </CardTitle>
              <CardDescription>Your earned vouchers</CardDescription>
            </CardHeader>
            <CardContent>
              {redeemedVouchers.length > 0 ? (
                <div className="space-y-4">
                  {redeemedVouchers.map((redeemed) => (
                    <div
                      key={redeemed.id}
                      className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{redeemed.vouchers.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {redeemed.vouchers.cost_points} pts
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">Voucher Code</div>
                        <div className="p-2 bg-success/10 border border-success rounded font-mono text-sm">
                          {redeemed.vouchers.code}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Redeemed on {format(new Date(redeemed.redeemed_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No redeemed vouchers yet</p>
                  <p className="text-sm">Earn points to unlock rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
