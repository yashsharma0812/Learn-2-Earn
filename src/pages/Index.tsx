import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Trophy, Gift, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Learn & Earn Rewards</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-primary bg-clip-text text-transparent">
              Learn2Earn
            </h1>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Master new skills, complete interactive quizzes, and earn points to redeem exciting rewards.
              Your learning journey, rewarded.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-primary hover:shadow-glow transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card shadow-card-hover hover:shadow-primary transition-all duration-300 border border-border">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Interactive Modules</h3>
              <p className="text-muted-foreground">
                Engage with comprehensive learning modules covering web development, Python, databases, and more.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card shadow-card-hover hover:shadow-primary transition-all duration-300 border border-border">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <Trophy className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Earn Points</h3>
              <p className="text-muted-foreground">
                Complete quizzes and earn points for every module you master. Track your progress in real-time.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card shadow-card-hover hover:shadow-primary transition-all duration-300 border border-border">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Gift className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Redeem Rewards</h3>
              <p className="text-muted-foreground">
                Exchange your earned points for gift cards, course discounts, and exclusive vouchers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">5+</div>
              <div className="text-muted-foreground">Learning Modules</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">50</div>
              <div className="text-muted-foreground">Points per Module</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">5+</div>
              <div className="text-muted-foreground">Rewards Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Start Learning?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join Learn2Earn today and transform your learning journey into tangible rewards.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 shadow-primary hover:shadow-glow transition-all"
            onClick={() => navigate("/auth")}
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
