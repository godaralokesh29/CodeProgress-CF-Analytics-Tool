import React from 'react';
import { ArrowRight, BarChart3, Trophy, Target, TrendingUp, Clock, Users, Calendar, Award, Play, Check, Star, Zap, Twitter, Github, Mail, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hero Component
const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-xl font-bold text-white">CodeProgress</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
         
          <button 
            onClick={() => navigate('/signin')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Track Your Competitive Programming Journey</span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Codeforces Performance
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get comprehensive insights into your competitive programming journey. Track contests, analyze problem-solving patterns, and accelerate your growth with detailed analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/signin')}
              className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <span>Start Analyzing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-800/30"
            >
              Enter Codeforces Handle
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 mt-12 text-slate-400">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Detailed Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span>Contest Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Component
const Features: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Rating Analytics",
      description: "Track your rating progression over time with detailed graphs and trend analysis to understand your competitive programming growth.",
      color: "blue"
    },
    {
      icon: Trophy,
      title: "Contest History",
      description: "Complete overview of all your contests with performance metrics, rankings, and problem-solving statistics.",
      color: "purple"
    },
    {
      icon: Target,
      title: "Problem Analysis",
      description: "Detailed breakdown of problems solved by difficulty, tags, and topics to identify your strengths and weaknesses.",
      color: "green"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor your solving speed and time efficiency across different problem categories and difficulty levels.",
      color: "orange"
    },
    {
      icon: Users,
      title: "Peer Comparison",
      description: "Compare your performance with friends and other competitive programmers to stay motivated and competitive.",
      color: "red"
    },
    {
      icon: Calendar,
      title: "Contest Calendar",
      description: "Never miss a contest with our integrated calendar and reminder system for upcoming competitions.",
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
  };

  return (
    <section id="features" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Excel</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive analytics and insights to help you understand your competitive programming journey and reach new heights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className={`inline-flex p-3 rounded-xl border mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Component
const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      color: "blue"
    },
    {
      icon: Trophy,
      value: "50,000+",
      label: "Contests Tracked",
      color: "purple"
    },
    {
      icon: BarChart3,
      value: "1M+",
      label: "Problems Analyzed",
      color: "green"
    },
    {
      icon: Clock,
      value: "99.9%",
      label: "Uptime",
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    orange: "text-orange-400"
  };

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Thousands</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join the growing community of competitive programmers who use CFAnalytics to track and improve their performance.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className={`w-8 h-8 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-slate-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// Pricing Component
const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic analytics",
      features: [
        "Basic contest history",
        "Rating tracking",
        "Problem statistics",
        "Monthly reports",
        "Community support"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonClass: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800/30"
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "Advanced analytics for serious competitive programmers",
      features: [
        "Everything in Free",
        "Advanced analytics",
        "Custom reports",
        "Contest predictions",
        "Performance insights",
        "Priority support",
        "Export data"
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonClass: "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      description: "For competitive programming teams and coaches",
      features: [
        "Everything in Pro",
        "Team management",
        "Bulk analytics",
        "Custom branding",
        "Advanced integrations",
        "Dedicated support",
        "Training insights"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonClass: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800/30"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Plan</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include core analytics features with no hidden fees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-slate-800/30 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:bg-slate-800/50 ${
                plan.popular 
                  ? 'border-blue-500/50 hover:border-blue-500/70 scale-105 hover:scale-110' 
                  : 'border-slate-700/50 hover:border-slate-600/50 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-slate-300">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.buttonClass}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white">CFAnalytics</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              The ultimate analytics platform for competitive programmers. Track your progress, analyze performance, and reach new heights in competitive programming.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 CFAnalytics. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-slate-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>for competitive programmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage; 