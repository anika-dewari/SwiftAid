"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { FloatingCard } from "@/components/ui/floating-card";
import { AnimatedTextGenerate } from "@/components/ui/animated-textgenerate";
import BackgroundMeteors from "@/components/ui/backgroundmeteors";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Heart,
  Users,
  Award,
  Target,
  Clock,
  Shield,
  Globe,
  Zap,
  ArrowLeft,
  Star,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  const heroText = "Excellence in emergency response. Every second counts when lives are at stake. We deliver precision, speed, and compassion in critical moments.";
  
  const missionText = "Transforming emergency medical services through innovative technology and unwavering dedication to saving lives.";

  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Medical Officer",
      avatar: "SM",
      bio: "15+ years in emergency medicine, pioneering trauma response protocols.",
      specialties: ["Emergency Medicine", "Trauma Surgery", "Critical Care"],
      achievements: ["Board Certified EM", "Trauma Center Director", "Research Publications: 45+"]
    },
    {
      name: "Michael Rodriguez",
      role: "Operations Director", 
      avatar: "MR",
      bio: "Former paramedic with 20 years field experience, now optimizing dispatch systems.",
      specialties: ["Emergency Operations", "Fleet Management", "Training Programs"],
      achievements: ["EMS Veteran", "Dispatch Optimization", "Team Leadership"]
    },
    {
      name: "Emily Watson",
      role: "Technology Lead",
      avatar: "EW", 
      bio: "Software architect specializing in real-time emergency response systems.",
      specialties: ["Real-time Systems", "GPS Tracking", "Data Analytics"],
      achievements: ["Tech Innovation Award", "System Architecture", "AI Integration"]
    },
    {
      name: "David Chen",
      role: "Quality Assurance",
      avatar: "DC",
      bio: "Healthcare quality expert ensuring highest standards in patient care.",
      specialties: ["Quality Standards", "Compliance", "Process Improvement"],
      achievements: ["Healthcare Quality", "ISO Certification", "Process Excellence"]
    }
  ];

  const stats = [
    { label: "Lives Saved", value: "50,000+", icon: Heart, color: "red" },
    { label: "Response Time", value: "4.2min", icon: Clock, color: "blue" },
    { label: "Fleet Size", value: "150+", icon: Users, color: "green" },
    { label: "Hospitals", value: "25", icon: Globe, color: "purple" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "Every call is someone's worst day. We respond with empathy, professionalism, and the highest level of medical care."
    },
    {
      icon: Zap,
      title: "Innovation", 
      description: "Cutting-edge technology and data-driven insights help us deliver faster, more effective emergency medical services."
    },
    {
      icon: Shield,
      title: "Excellence",
      description: "Rigorous training, continuous improvement, and unwavering commitment to the highest standards of emergency care."
    },
    {
      icon: Target,
      title: "Precision",
      description: "Strategic deployment, optimal routing, and real-time coordination ensure the right resources reach patients quickly."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 150 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Button className="hover-lift">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 animate-float">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <GradientText from="blue-500" to="purple-500" className="text-2xl">
                About SwiftAid
              </GradientText>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton className="animate-glow bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Phone className="mr-2 h-4 w-4" />
              Contact Us
            </AnimatedButton>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Meteor Hero Section */}
      <BackgroundMeteors className="min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="relative z-20 text-center font-bold text-white font-sans tracking-tight text-[clamp(2rem,6vw,6rem)] mb-8">
              It&apos;s only delusional
              <br />
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-500 via-purple-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span>until it works.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4">
                  <span>until it works.</span>
                </div>
              </div>
            </h1>
            
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Every innovation in emergency medicine starts with a vision that others call impossible. 
              SwiftAid transforms that vision into life-saving reality.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <AnimatedButton
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl text-lg px-8 py-4 animate-glow"
                variant="shimmer"
                size="lg"
                animation="shimmer"
                shimmerColor="#8b5cf6"
              >
                Our Mission
              </AnimatedButton>
              
              <AnimatedButton
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl text-lg px-8 py-4"
                size="lg"
              >
                Meet the Team
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </BackgroundMeteors>

      <div className="container mx-auto p-6 space-y-16">
        {/* Hero Section with Animated Text */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText from="blue-500" to="purple-500" className="text-5xl md:text-7xl">
                SwiftAid
              </GradientText>
            </h1>
            <div className="max-w-4xl mx-auto">
              <AnimatedTextGenerate
                className="text-center mb-8 p-4"
                textClassName="text-xl md:text-2xl lg:text-3xl text-center leading-relaxed"
                text={heroText}
                blurEffect
                speed={2}
                highlightWords={["Excellence", "second", "lives", "precision", "speed", "compassion"]}
                highlightClassName="text-red-500 dark:text-red-400 font-bold animate-pulse"
                linkWords={["emergency", "critical", "response"]}
                linkHrefs={["/emergency", "/dashboard", "/dashboard"]}
                linkClassNames={[
                  "underline decoration-blue-500 dark:decoration-blue-400 hover:decoration-blue-400 dark:hover:decoration-blue-300 transition",
                  "underline decoration-purple-500 dark:decoration-purple-400 hover:decoration-purple-400 dark:hover:decoration-purple-300 transition",
                  "underline decoration-green-500 dark:decoration-green-400 hover:decoration-green-400 dark:hover:decoration-green-300 transition",
                ]}
                delay={500}
              />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <FloatingCard delay={index * 0.1} className="text-center p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}-500 mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <FloatingCard className="max-w-4xl mx-auto p-12 glass">
            <h2 className="text-4xl font-bold mb-8">
              <GradientText from="indigo-500" to="purple-500">
                Our Mission
              </GradientText>
            </h2>
            <AnimatedTextGenerate
              className="text-center"
              textClassName="text-xl md:text-2xl text-center leading-relaxed"
              text={missionText}
              blurEffect
              speed={3}
              highlightWords={["technology", "dedication", "saving", "lives"]}
              highlightClassName="text-purple-500 dark:text-purple-400 font-bold"
              delay={1000}
            />
          </FloatingCard>
        </motion.section>

        {/* Core Values */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              <GradientText from="blue-500" to="green-500">
                Our Values
              </GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision and action in our mission to save lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div key={value.title} variants={itemVariants}>
                <FloatingCard delay={index * 0.15} className="p-8 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-float">
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">
                        <GradientText from="blue-500" to="purple-500">
                          {value.title}
                        </GradientText>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              <GradientText from="purple-500" to="pink-500">
                Our Team
              </GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals who make SwiftAid's life-saving mission possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} variants={itemVariants}>
                <FloatingCard delay={index * 0.1} className="text-center p-6 h-full">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold animate-float">
                      {member.avatar}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-500 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Achievements</h4>
                      <div className="space-y-1">
                        {member.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center justify-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <FloatingCard className="max-w-4xl mx-auto p-12 glass">
            <h2 className="text-4xl font-bold mb-8">
              <GradientText from="green-500" to="blue-500">
                Get In Touch
              </GradientText>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Phone className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-bold mb-2">Emergency Line</h3>
                <p className="text-muted-foreground">911</p>
                <p className="text-muted-foreground">Available 24/7</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-muted-foreground">info@swiftaid.com</p>
                <p className="text-muted-foreground">Response within 24h</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <MapPin className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-bold mb-2">Headquarters</h3>
                <p className="text-muted-foreground">123 Emergency Drive</p>
                <p className="text-muted-foreground">Medical District</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton className="bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-glow">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </AnimatedButton>
              <AnimatedButton className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </AnimatedButton>
            </div>
          </FloatingCard>
        </motion.section>
      </div>
    </div>
  );
}