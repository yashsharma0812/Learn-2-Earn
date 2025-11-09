import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const Rewards = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<Set<string>>(new Set());
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
      fetchRewardsData(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchRewardsData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Fetch vouchers
      const { data: vouchersData } = await supabase
        .from("vouchers")
        .select("*")
        .order("cost_points");

      setVouchers(vouchersData || []);

      // Fetch redeemed vouchers
      const { data: redeemedData } = await supabase
        .from("redeemed_vouchers")
        .select("voucher_id")
        .eq("user_id", userId);

      setRedeemedVouchers(new Set(redeemedData?.map((r) => r.voucher_id) || []));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (voucher: any) => {
    if (!profile || profile.points < voucher.cost_points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${voucher.cost_points} points to redeem this voucher. Keep learning!`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Deduct points
      const newPoints = profile.points - voucher.cost_points;
      await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", user.id);

      // Add to redeemed vouchers
      await supabase.from("redeemed_vouchers").insert({
        user_id: user.id,
        voucher_id: voucher.id,
      });

      // Update local state
      setProfile({ ...profile, points: newPoints });
      setRedeemedVouchers(new Set([...redeemedVouchers, voucher.id]));

      // Celebrate!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast({
        title: "🎉 Voucher Redeemed!",
        description: `Your voucher code: ${voucher.code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem voucher",
        variant: "destructive",
      });
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Rewards Marketplace</h1>
              <p className="text-muted-foreground text-lg">
                Redeem your points for exciting vouchers
              </p>
            </div>
            <Card className="shadow-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-accent" />
                  <div>
                    <div className="text-sm text-muted-foreground">Your Points</div>
                    <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      {profile?.points || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => {
            const isRedeemed = redeemedVouchers.has(voucher.id);
            const canAfford = profile && profile.points >= voucher.cost_points;

            return (
              <Card
                key={voucher.id}
                className={`shadow-card-hover hover:shadow-primary transition-all ${
                  isRedeemed ? "opacity-75" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Gift className="h-6 w-6 text-accent" />
                    </div>
                    {isRedeemed ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Redeemed
                      </Badge>
                    ) : (
                      <Badge variant={canAfford ? "default" : "secondary"} className="gap-1">
                        <Trophy className="h-3 w-3" />
                        {voucher.cost_points} pts
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{voucher.name}</CardTitle>
                  <CardDescription>{voucher.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isRedeemed ? (
                    <div className="p-3 bg-success/10 border border-success rounded-lg text-center">
                      <div className="text-sm font-medium text-success-foreground mb-1">
                        Voucher Code
                      </div>
                      <div className="text-lg font-mono font-bold">{voucher.code}</div>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={!canAfford}
                      onClick={() => handleRedeem(voucher)}
                    >
                      {canAfford ? "Redeem Now" : "Not Enough Points"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {vouchers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No vouchers available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
