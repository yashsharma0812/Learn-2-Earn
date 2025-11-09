import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const Rewards = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Mock vouchers data
    const mockVouchers = [
      {
        id: '1',
        title: '$10 Amazon Gift Card',
        description: 'Redeem for Amazon shopping',
        cost_points: 500,
        available_quantity: 10
      },
      {
        id: '2',
        title: '$25 Starbucks Gift Card',
        description: 'Enjoy your favorite coffee',
        cost_points: 1000,
        available_quantity: 5
      },
      {
        id: '3',
        title: '$50 Udemy Course Voucher',
        description: 'Learn new skills',
        cost_points: 2000,
        available_quantity: 3
      }
    ];
    setVouchers(mockVouchers);
  }, []);

  const handleRedeem = async (voucher: any) => {
    if (!user || (user.points || 0) < voucher.cost_points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${voucher.cost_points} points to redeem this voucher. Keep learning!`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock redeem - in real app, this would call your backend API
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
                      {user?.points || 0}
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
            const canAfford = user && (user.points || 0) >= voucher.cost_points;

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
