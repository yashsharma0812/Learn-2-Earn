import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const ModuleDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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
      fetchModuleData(session.user.id);
    };

    checkAuth();
  }, [id, navigate]);

  const fetchModuleData = async (userId: string) => {
    try {
      // Fetch module
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (moduleError) throw moduleError;
      setModule(moduleData);

      // Check if completed
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("module_id", id)
        .eq("completed", true)
        .maybeSingle();

      setIsCompleted(!!progressData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load module",
        variant: "destructive",
      });
      navigate("/modules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Select an answer",
        description: "Please select an option before submitting",
        variant: "destructive",
      });
      return;
    }

    const correct = parseInt(selectedAnswer) === module.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct && !isCompleted) {
      // Award points and mark as complete
      try {
        // Update user points
        const { data: profileData } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();

        const newPoints = (profileData?.points || 0) + module.points_reward;

        await supabase
          .from("profiles")
          .update({ points: newPoints })
          .eq("id", user.id);

        // Mark module as complete
        await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            module_id: module.id,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        setIsCompleted(true);

        // Celebrate!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        toast({
          title: "🎉 Congratulations!",
          description: `You earned ${module.points_reward} points!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
      }
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

  if (!module) return null;

  const quizOptions = module.quiz_options as string[];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/modules")} className="mb-4">
          ← Back to Modules
        </Button>

        <div className="space-y-6">
          {/* Module Info */}
          <Card className="shadow-primary">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {module.points_reward} points
                </Badge>
                {isCompleted && (
                  <Badge className="bg-success text-success-foreground gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl">{module.title}</CardTitle>
              <CardDescription className="text-base">{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">{module.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          <Card className="shadow-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Knowledge Check
              </CardTitle>
              <CardDescription>
                {isCompleted
                  ? "You've already completed this quiz, but feel free to review!"
                  : "Answer correctly to earn points"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">{module.quiz_question}</h3>
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  disabled={showResult}
                >
                  {quizOptions.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-base cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {showResult && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-success/10 border-success text-success-foreground"
                      : "bg-destructive/10 border-destructive text-destructive-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Correct Answer!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Incorrect Answer
                      </>
                    )}
                  </div>
                  {isCorrect ? (
                    <p>Great job! {!isCompleted && `You've earned ${module.points_reward} points.`}</p>
                  ) : (
                    <p>The correct answer is: {quizOptions[module.correct_answer]}</p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                {!showResult && (
                  <Button onClick={handleSubmitQuiz} className="flex-1">
                    Submit Answer
                  </Button>
                )}
                {showResult && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResult(false);
                        setSelectedAnswer("");
                      }}
                      className="flex-1"
                    >
                      Try Again
                    </Button>
                    <Button onClick={() => navigate("/modules")} className="flex-1">
                      Continue Learning
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
