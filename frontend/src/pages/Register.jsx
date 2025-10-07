import { useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser, getUserInfo } from "../api";

/**
 * Modern Register Page Component
 * 
 * Beautiful, contemporary design matching the home page aesthetic
 * Features gradient accents, smooth animations, and glassmorphism
 * 
 * Handles new user registration with name, email, and password
 * Includes form validation, password strength indicator, and success feedback
 * 
 * Note: Replace <a> tags with Link components and add your API calls
 */
export default function Register({ setUser }) {
  // Your existing state - keeping all your logic intact
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  /**
   * Handles form submission for user registration
   * Connect to your registerUser API and navigate functions
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Basic client-side validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Uncomment and connect to your actual API
      const result = await registerUser(form);
      if (result && result.message) {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo._id) {
          setUser(userInfo);
          setMessage('Registration successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1200);
        } else {
          setError('Registration completed but failed to fetch user. Please try logging in.');
        }
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }   
       
    } catch (err) {
      setError("Network error. Please try again.", err);
      setIsLoading(false);
    }
  }

  /**
   * Updates form state when input values change
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (error) setError("");
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  }

  /**
   * Calculates password strength based on various criteria
   */
  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }

  /**
   * Gets password strength color and text
   */
  function getPasswordStrengthInfo() {
    const levels = [
      { color: 'text-red-600', text: 'Very Weak', bg: 'bg-red-500' },
      { color: 'text-orange-600', text: 'Weak', bg: 'bg-orange-500' },
      { color: 'text-yellow-600', text: 'Fair', bg: 'bg-yellow-500' },
      { color: 'text-blue-600', text: 'Good', bg: 'bg-blue-500' },
      { color: 'text-green-600', text: 'Strong', bg: 'bg-green-500' }
    ];
    return levels[Math.min(passwordStrength, 4)];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
          {/* Logo */}
          <a href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Colabo
            </span>
          </a>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Create your account
          </h1>
          <p className="text-slate-600">
            Join thousands of teams collaborating better
          </p>
        </div>

        {/* Main Card with glassmorphism */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
          
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="space-y-6">
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-slate-400" size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-slate-400" size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit(e)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthInfo().bg}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-semibold ${getPasswordStrengthInfo().color}`}>
                        {getPasswordStrengthInfo().text}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use 8+ characters with uppercase, numbers, and symbols
                    </p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-sm text-slate-600 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Success</p>
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleFormSubmit}
                className="group w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-500 font-medium">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700 disabled:opacity-50"
            disabled
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700 disabled:opacity-50"
            disabled
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5E5E5E">
              <path d="M11.4 24H0V8h11.4v16zM24 24H12.6V8H24v16zM24 7H0V0h24v7z"/>
            </svg>
            Microsoft
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
            <Shield className="text-green-500" size={16} />
            <p className="text-xs font-medium text-slate-600">
              Your data is encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}