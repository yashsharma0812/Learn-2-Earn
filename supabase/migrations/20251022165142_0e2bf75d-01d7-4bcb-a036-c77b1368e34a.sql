-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  quiz_question TEXT NOT NULL,
  quiz_options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 50 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  order_index INTEGER NOT NULL
);

-- Enable RLS for modules (public read)
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
  ON public.modules FOR SELECT
  USING (true);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create vouchers table
CREATE TABLE public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  code TEXT NOT NULL,
  cost_points INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS (public read)
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vouchers"
  ON public.vouchers FOR SELECT
  USING (true);

-- Create redeemed_vouchers table
CREATE TABLE public.redeemed_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.redeemed_vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their redeemed vouchers"
  ON public.redeemed_vouchers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their redeemed vouchers"
  ON public.redeemed_vouchers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, points)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    0
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample modules
INSERT INTO public.modules (title, description, content, quiz_question, quiz_options, correct_answer, points_reward, order_index) VALUES
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript', 'Web development is the foundation of the internet. In this module, you''ll learn about HTML for structure, CSS for styling, and JavaScript for interactivity. These three technologies work together to create amazing web experiences.', 'Which technology is used for styling web pages?', '["HTML", "CSS", "JavaScript", "Python"]', 1, 50, 1),
('Python Fundamentals', 'Master the basics of Python programming', 'Python is a powerful, beginner-friendly programming language. In this module, you''ll learn about variables, data types, loops, functions, and object-oriented programming. Python is used in web development, data science, AI, and more.', 'What is Python primarily known for?', '["Being difficult to learn", "Readability and simplicity", "Only working on Windows", "Game development only"]', 1, 50, 2),
('Database Design Basics', 'Understanding relational databases and SQL', 'Databases are essential for storing and managing data. Learn about tables, relationships, primary keys, foreign keys, and SQL queries. You''ll understand how to design efficient database schemas and retrieve data effectively.', 'What does SQL stand for?', '["Simple Query Language", "Structured Query Language", "System Quality Language", "Standard Question Language"]', 1, 50, 3),
('React for Beginners', 'Build modern user interfaces with React', 'React is a popular JavaScript library for building user interfaces. Learn about components, props, state, hooks, and the virtual DOM. You''ll be able to create dynamic, interactive web applications.', 'What is a React component?', '["A database", "A reusable piece of UI", "A CSS file", "A backend server"]', 1, 50, 4),
('API Development', 'Create and consume RESTful APIs', 'APIs allow different software systems to communicate. Learn how to design, build, and consume RESTful APIs using modern best practices. Understand HTTP methods, status codes, authentication, and API documentation.', 'Which HTTP method is used to retrieve data?', '["POST", "DELETE", "GET", "PUT"]', 2, 50, 5);

-- Insert sample vouchers
INSERT INTO public.vouchers (name, description, code, cost_points) VALUES
('Amazon ₹500 Gift Card', 'Redeem for ₹500 on Amazon', 'AMZN500', 200),
('Flipkart ₹300 Voucher', 'Shop for ₹300 on Flipkart', 'FLIP300', 150),
('Udemy Course Discount', '50% off any Udemy course', 'UDEMY50', 100),
('Starbucks ₹200', 'Coffee on us!', 'STAR200', 100),
('Netflix 1 Month', '1 month Netflix subscription', 'NFLX1M', 250);