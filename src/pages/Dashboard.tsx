import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Gift, Sparkles, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = { completed: 0, total: 10, points: user?.points || 0 };
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.username || "Learner"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey and earn more rewards
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card-hover hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Points
              </CardTitle>
              <Trophy className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                {stats.points}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep learning to earn more!
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card-hover hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Modules Completed
              </CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.completed} / {stats.total}
              </div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card-hover hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progress
              </CardTitle>
              <Sparkles className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total - stats.completed} modules remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card-hover hover:shadow-primary transition-all cursor-pointer" onClick={() => navigate("/modules")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Explore available modules and complete quizzes to earn points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group">
                Browse Modules
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card-hover hover:shadow-primary transition-all cursor-pointer" onClick={() => navigate("/rewards")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-accent" />
                Redeem Rewards
              </CardTitle>
              <CardDescription>
                Use your {stats.points} points to unlock exciting vouchers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full group">
                View Rewards
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
