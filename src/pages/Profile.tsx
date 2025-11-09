import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Gift, Calendar, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [completedModules, setCompletedModules] = useState<any[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfileData(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchProfileData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Fetch completed modules
      const { data: progressData } = await supabase
        .from("user_progress")
        .select(`
          *,
          modules:module_id (*)
        `)
        .eq("user_id", userId)
        .eq("completed", true)
        .order("completed_at", { ascending: false });

      setCompletedModules(progressData || []);

      // Fetch redeemed vouchers
      const { data: redeemedData } = await supabase
        .from("redeemed_vouchers")
        .select(`
          *,
          vouchers:voucher_id (*)
        `)
        .eq("user_id", userId)
        .order("redeemed_at", { ascending: false });

      setRedeemedVouchers(redeemedData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
                <CardTitle className="text-3xl">{profile?.username}</CardTitle>
                <CardDescription className="text-base">
                  Member since {format(new Date(profile?.created_at), "MMMM yyyy")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-accent/10">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  {profile?.points || 0}
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
