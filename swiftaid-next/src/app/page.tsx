"use client";

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
  Heart
} from "lucide-react";

export default function Home() {
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
          
          <div className="flex items-center space-x-4">
            <Button asChild className="hover-lift">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="hover-lift">
              <Link href="/emergency">Emergency Portal</Link>
            </Button>
            <Button asChild className="hover-lift">
              <Link href="/about">About Us</Link>
            </Button>
            <AnimatedButton animation="glow" className="animate-heartbeat bg-red-500 hover:bg-red-600 text-white">
              <Link href="/emergency" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Emergency
              </Link>
            </AnimatedButton>
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
                icon: "🤖",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Predictive Analytics",  
                description: "Forecast emergency patterns and pre-position resources strategically",
                icon: "📊",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Real-Time Coordination",
                description: "Instant communication between dispatch, ambulances, and hospitals",
                icon: "⚡",
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
                <div className={`text-4xl mb-4 p-3 rounded-lg bg-gradient-to-r ${tech.color} w-fit mx-auto text-white flex items-center justify-center`}>
                  {tech.icon}
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
    </div>
  );
}