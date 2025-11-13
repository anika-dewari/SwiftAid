"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedTextGenerate } from "@/components/ui/animated-textgenerate";
import BackgroundMeteors from "@/components/ui/backgroundmeteors";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  Ambulance, 
  Activity, 
  Hospital, 
  Users, 
  AlertTriangle,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Phone,
  Heart,
  Bot,
  BarChart3,
  Zap,
  LogIn,
  UserPlus
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect based on role
    if (user?.role === 'driver') {
      router.push('/driver/dashboard');
    } else if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  };
  const stats = [
    { icon: Ambulance, label: "Active Ambulances", value: "24", color: "text-blue-500" },
    { icon: Hospital, label: "Connected Hospitals", value: "12", color: "text-green-500" },
    { icon: Activity, label: "Response Time", value: "4.2min", color: "text-orange-500" },
    { icon: Users, label: "Active Emergencies", value: "7", color: "text-red-500" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track ambulances and emergency units in real-time with GPS precision",
    },
    {
      icon: Clock,
      title: "Fast Response",
      description: "Optimized dispatch algorithms for 25% faster emergency response times",
    },
    {
      icon: Shield,
      title: "Secure System",
      description: "HIPAA-compliant platform ensuring patient data privacy and security",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Ambulance className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SwiftAid</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
              <Users className="w-4 h-4" />
              Our Team
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button onClick={handleDashboardClick} className="hover-lift">
                  Dashboard
                </Button>
                <Button asChild className="hover-lift">
                  <Link href="/emergency">Emergency Portal</Link>
                </Button>
                <AnimatedButton animation="glow" className="animate-heartbeat bg-red-500 hover:bg-red-600 text-white">
                  <Link href="/emergency" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency
                  </Link>
                </AnimatedButton>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="hover-lift">
                  <Link href="/auth/login" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild className="hover-lift bg-red-500 hover:bg-red-600">
                  <Link href="/auth/register" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Meteor Hero Section */}
      <BackgroundMeteors className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="relative z-20 text-center font-bold text-white font-sans tracking-tight text-[clamp(2rem,8vw,8rem)] mb-8">
              Swift Emergency Response
              <br />
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-red-500 via-blue-500 to-purple-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span>saves lives.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 py-4">
                  <span>saves lives.</span>
                </div>
              </div>
            </h1>
            
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Every second counts in emergency response. Our intelligent dispatch system 
              reduces response times by 25% through real-time optimization and data-driven decisions.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <AnimatedButton
                className="bg-red-500 hover:bg-red-600 text-white shadow-2xl text-lg px-8 py-4 animate-glow"
                size="lg"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Emergency Call
              </AnimatedButton>
              
              <AnimatedButton
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl text-lg px-8 py-4"
                variant="shimmer"
                size="lg"
                animation="shimmer"
                shimmerColor="#60a5fa"
              >
                <Activity className="mr-2 h-5 w-5" />
                Live Dashboard
              </AnimatedButton>
            </motion.div>
            
            {/* Stats in Meteor Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {[
                { value: "4.2min", label: "Avg Response", icon: Clock, color: "from-green-400 to-blue-500" },
                { value: "50k+", label: "Lives Saved", icon: Heart, color: "from-red-400 to-pink-500" },
                { value: "25+", label: "Hospitals", icon: Hospital, color: "from-blue-400 to-purple-500" },
                { value: "150+", label: "Ambulances", icon: Ambulance, color: "from-purple-400 to-indigo-500" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </BackgroundMeteors>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Smart Emergency
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Dispatch System
                </span>
              </h1>
              <div className="max-w-2xl">
                <AnimatedTextGenerate
                  className="mb-6"
                  textClassName="text-lg text-muted-foreground leading-relaxed"
                  text="Reducing response times by 25% through intelligent ambulance dispatch and optimal hospital selection powered by advanced data analytics. Every second matters in emergency care."
                  blurEffect
                  speed={3}
                  highlightWords={["25%", "intelligent", "emergency", "second", "matters"]}
                  highlightClassName="text-blue-500 dark:text-blue-400 font-semibold"
                  linkWords={["ambulance", "hospital", "analytics"]}
                  linkHrefs={["/ambulances", "/hospitals", "/dashboard"]}
                  linkClassNames={[
                    "underline decoration-green-500 dark:decoration-green-400 hover:decoration-green-400 dark:hover:decoration-green-300 transition",
                    "underline decoration-blue-500 dark:decoration-blue-400 hover:decoration-blue-400 dark:hover:decoration-blue-300 transition",
                    "underline decoration-purple-500 dark:decoration-purple-400 hover:decoration-purple-400 dark:hover:decoration-purple-300 transition",
                  ]}
                  delay={1000}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/dashboard">
                  Live Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              {/* ScrollX UI Demo Button */}
              <AnimatedButton
                className="bg-green-500 text-white shadow-2xl text-lg animate-glow"
                variant="shimmer"
                size="lg"
                animation="shimmer"
                rounded="full"
                shimmerColor="#39FF14"
              >
                ScrollX UI
              </AnimatedButton>
              
              <Button variant="outline" size="lg" className="text-lg" asChild>
                <Link href="/emergency">Emergency Portal</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">99.7%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-white/50 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Advanced Emergency Management
          </h2>
          <div className="max-w-4xl mx-auto">
            <AnimatedTextGenerate
              className="mb-4"
              textClassName="text-lg text-muted-foreground text-center"
              text="Our intelligent system combines real-time data, predictive analytics, and optimized routing to save lives through faster emergency response. Innovation meets compassion in every dispatch."
              blurEffect
              speed={2.5}
              highlightWords={["intelligent", "real-time", "predictive", "save lives", "Innovation", "compassion"]}
              highlightClassName="text-purple-500 dark:text-purple-400 font-semibold"
              delay={500}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-fit">
                    <feature.icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Innovation Section */}
      <BackgroundPaths 
        className="h-[70vh] flex items-center justify-center w-full flex-col px-4"
        svgOptions={{ duration: 10 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-sans py-2 md:py-8 relative z-20 font-bold tracking-tight">
            Next-Generation Emergency, <br /> Intelligent Dispatch.
          </h2>
          <p className="max-w-3xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
            Powered by artificial intelligence, real-time data analytics, and 
            machine learning algorithms that save precious seconds in critical emergencies.
          </p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, staggerChildren: 0.2 }}
          >
            {[
              {
                title: "AI Route Optimization",
                description: "Machine learning algorithms calculate the fastest path in real-time",
                icon: Bot,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Predictive Analytics",  
                description: "Forecast emergency patterns and pre-position resources strategically",
                icon: BarChart3,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Real-Time Coordination",
                description: "Instant communication between dispatch, ambulances, and hospitals",
                icon: Zap,
                color: "from-green-500 to-emerald-500"
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                className="relative p-6 rounded-xl bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              >
                <div className={`mb-4 p-4 rounded-lg bg-gradient-to-r ${tech.color} w-fit mx-auto text-white flex items-center justify-center`}>
                  <tech.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{tech.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg shadow-xl">
              <Activity className="mr-2 h-5 w-5" />
              Experience the Technology
            </Button>
          </motion.div>
        </motion.div>
      </BackgroundPaths>

      {/* About Us Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-24 md:px-6"
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            About SwiftAid
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing Emergency Response with Technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
              <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2">
                <CardContent className="p-8">
                  <Heart className="w-16 h-16 text-red-500 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    SwiftAid is dedicated to saving lives by reducing emergency response times through 
                    intelligent technology and real-time coordination. We connect patients, ambulance 
                    drivers, and hospitals in a seamless network that ensures rapid, efficient care.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our platform uses advanced algorithms, GPS tracking, and AI-powered dispatch to 
                    optimize emergency response, ensuring help arrives when it's needed most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Real-Time Tracking</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monitor ambulance locations and estimated arrival times with live GPS updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Secure & Compliant</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      HIPAA-compliant platform ensuring patient data privacy and security
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Lightning Fast</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI-powered dispatch reduces response times by 25% on average
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Meet Our Team Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border-2 border-blue-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-blue-600 mr-3" />
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Meet Our Team
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                The brilliant minds behind SwiftAid - Anika, Ayush, and Ritika
              </p>
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl text-lg px-8 py-6 group"
              >
                <Link href="/about" className="flex items-center">
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Meet the Team
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-24"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Four simple steps to get emergency help fast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Report Emergency",
                description: "User reports emergency through our app or calls emergency hotline",
                icon: AlertTriangle,
                color: "from-red-500 to-pink-500"
              },
              {
                step: "2",
                title: "Smart Dispatch",
                description: "AI algorithm selects nearest available ambulance and optimizes route",
                icon: Bot,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "3",
                title: "Real-Time Tracking",
                description: "Patient and hospital track ambulance location with live GPS updates",
                icon: MapPin,
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "4",
                title: "Rapid Response",
                description: "Ambulance arrives quickly, patient gets immediate care at hospital",
                icon: Hospital,
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 hover:shadow-2xl transition-all hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                        {item.step}
                      </div>
                      <div className="absolute top-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                        <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-24 md:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Have questions? We're here to help 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="h-full backdrop-blur-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2">
                <CardContent className="p-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Emergency Hotline</h3>
                  <p className="text-2xl font-bold text-red-600 mb-1">911</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="h-full backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2">
                <CardContent className="p-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Support Line</h3>
                  <p className="text-xl font-bold text-blue-600 mb-1">1-800-SWIFTAID</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri 9AM-5PM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="h-full backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2">
                <CardContent className="p-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Email Support</h3>
                  <p className="text-sm font-semibold text-green-600 mb-1">support@swiftaid.com</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24-48 hour response</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Emergency Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16 md:px-6"
      >
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 border-none text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Emergency Situation?</h3>
            </div>
            <p className="text-lg mb-6 opacity-90">
              Get immediate help through our advanced emergency dispatch system
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/emergency">
                <Phone className="mr-2 h-5 w-5" />
                Access Emergency Portal
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Ambulance className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SwiftAid</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Revolutionizing emergency response with intelligent technology. 
                Saving lives, one second at a time.
              </p>
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/emergency" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Portal
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                </li>
                <li className="text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Real-Time Tracking
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">Emergency</p>
                    <p className="text-gray-300">911</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-400">Support</p>
                    <p className="text-gray-300">1-800-SWIFTAID</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-400">Email</p>
                    <p className="text-gray-300 text-xs">support@swiftaid.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-400">Location</p>
                    <p className="text-gray-300 text-xs">Nationwide Service</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 SwiftAid. All rights reserved. Saving lives with technology.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  HIPAA Compliance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}