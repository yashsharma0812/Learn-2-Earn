import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Trophy } from "lucide-react";

const Modules = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      // Mock modules data for now
      const mockModules = [
        {
          id: '1',
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          difficulty: 'Beginner',
          points: 100,
          order_index: 1
        },
        {
          id: '2',
          title: 'React Fundamentals',
          description: 'Master the fundamentals of React.js',
          difficulty: 'Intermediate',
          points: 150,
          order_index: 2
        },
        {
          id: '3',
          title: 'Backend with Node.js',
          description: 'Build powerful backends with Node.js and Express',
          difficulty: 'Intermediate',
          points: 200,
          order_index: 3
        }
      ];

      setModules(mockModules);
      setCompletedModules(new Set());
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Learning Modules</h1>
          <p className="text-muted-foreground text-lg">
            Complete modules and quizzes to earn points
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules.has(module.id);
            return (
              <Card
                key={module.id}
                className="shadow-card-hover hover:shadow-primary transition-all cursor-pointer group"
                onClick={() => navigate(`/modules/${module.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        {module.points_reward} pts
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={isCompleted ? "secondary" : "default"}
                  >
                    {isCompleted ? "Review Module" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modules;
