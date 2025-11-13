"use client"
import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Transition from "@/components/ui/transition"
import { motion } from "framer-motion"
import { Ambulance, AlertCircle } from "lucide-react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300",
          className
        )}
        style={{
          borderWidth: "2px",
          borderImage: `conic-gradient(
            rgb(212, 212, 212) 0deg,
            rgb(23, 23, 23) 90deg,
            rgb(212, 212, 212) 180deg,
            rgb(23, 23, 23) 270deg,
            rgb(212, 212, 212) 360deg
          ) 1 / 1 / 0 stretch`,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

interface SwiftAidLoginFormProps extends React.ComponentProps<"div"> {
  onSignUpClick?: () => void;
}

export function SwiftAidLoginForm({
  className,
  onSignUpClick,
  ...props
}: SwiftAidLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const introContent = (triggerExit: () => void) => (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
          <Ambulance className="w-12 h-12 text-white" />
        </div>
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-black text-center">
        SwiftAid
      </div>
      <div className="text-lg sm:text-xl md:text-2xl text-white dark:text-black font-light tracking-wide opacity-80 max-w-[280px] sm:max-w-md text-center break-words mt-4">
        Emergency Response System
      </div>
      <div className="mt-4 w-16 h-0.5 bg-white/50"></div>
      <button
        onClick={triggerExit}
        className="mt-8 px-6 py-2 border border-white/30 dark:border-black/30 text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-all duration-300 text-sm tracking-wide"
      >
        Continue to Login
      </button>
    </div>
  );

  const [transitionEnded, setTransitionEnded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "driver") {
        router.push("/driver/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Animated Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-sm md:max-w-3xl relative z-10">
        <div className={cn("flex flex-col gap-6 overflow-hidden", className)} {...props}>
          <Transition
            intro={introContent}
            introDuration={3}
            transitionDuration={1.2}
            type="slide"
            direction="right"
            className="bg-gradient-to-br from-blue-900 to-purple-900 dark:bg-white rounded-xl"
            autoExit={false}
            onFinished={() => setTransitionEnded(true)}
          >
            <Card className="overflow-hidden p-0 border-0 backdrop-blur-sm">
              <CardContent className="grid p-0 md:grid-cols-2 bg-[hsla(240,4%,16%,1)] dark:bg-white">
                <div className="p-6 md:p-8 relative">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Ambulance className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 bg-clip-text text-transparent">
                          Welcome back
                        </h1>
                      </div>
                      <p className="text-muted-foreground text-balance mt-2">
                        Login to your SwiftAid account
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm dark:text-black text-white font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm dark:text-black text-white font-medium">
                            Password
                          </Label>
                          <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline transition-colors"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-black dark:text-gray-200 px-3 text-gray-500 font-medium">
                          Quick Access
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setEmail("user@test.com");
                          setPassword("password123");
                        }}
                        className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all duration-200 hover:shadow-md"
                      >
                        <span className="text-xs">Test User</span>
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setEmail("driver@test.com");
                          setPassword("password123");
                        }}
                        className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all duration-200 hover:shadow-md"
                      >
                        <span className="text-xs">Test Driver</span>
                      </Button>
                    </div>

                    <div className="text-center text-sm dark:text-gray-600 text-gray-400">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={onSignUpClick || (() => router.push("/auth/register"))}
                        className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>

                <div className="relative hidden md:flex overflow-hidden w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=1920&auto=format&fit=crop"
                    alt="Emergency Response"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-purple-600/50"></div>
                </div>
              </CardContent>
            </Card>
          </Transition>

          {transitionEnded && (
            <div className="w-full max-w-sm md:max-w-3xl mx-auto px-4 sm:px-6">
              <motion.div
                className="text-muted-foreground text-center text-xs sm:text-sm text-balance break-words"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                By clicking continue, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                >
                  Privacy Policy
                </a>
                . Your data is protected by HIPAA compliance.
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
