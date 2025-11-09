import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const [module, setModule] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mock module data based on id
    const mockModules: any = {
      '1': {
        id: '1',
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript',
        difficulty: 'Beginner',
        points: 100,
        quiz_question: 'What does HTML stand for?',
        quiz_options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correct_answer: 0
      },
      '2': {
        id: '2',
        title: 'React Fundamentals',
        description: 'Master the fundamentals of React.js',
        difficulty: 'Intermediate',
        points: 150,
        quiz_question: 'What is JSX?',
        quiz_options: ['A JavaScript extension', 'A template engine', 'A styling framework', 'A database'],
        correct_answer: 0
      },
      '3': {
        id: '3',
        title: 'Backend with Node.js',
        description: 'Build powerful backends with Node.js and Express',
        difficulty: 'Intermediate',
        points: 200,
        quiz_question: 'What is Express.js?',
        quiz_options: ['A fast delivery service', 'A Node.js web framework', 'A database', 'A frontend library'],
        correct_answer: 1
      }
    };
    
    setModule(mockModules[id || '1'] || mockModules['1']);
  }, [id]);

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
      // Mock completion - in real app, this would call your backend API
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
