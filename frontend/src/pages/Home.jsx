import { ArrowRight, Zap, Shield, Users, Sparkles, CheckCircle2, Star } from "lucide-react";

/**
 * Modern Landing Page - Startup-Worthy Design
 * 
 * Features:
 * - Bold gradients and modern aesthetics
 * - Smooth animations and micro-interactions
 * - Contemporary typography and spacing
 * - Glassmorphism effects
 * - Mobile-first responsive design
 * 
 * Note: Replace <a> tags with your Link component from react-router-dom
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Modern Navigation with blur effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - replace href with Link to="/" */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Colabo
              </span>
            </a>
            
            {/* Nav Links - replace with Link components */}
            <div className="flex items-center gap-4">
              <a 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold and Eye-catching */}
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Star size={16} className="fill-blue-600 text-blue-600" />
              <span>Join 10,000+ productive teams</span>
            </div>

            {/* Main Headline - Bold and Impactful */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Collaborate
              </span>
              <br />
              <span className="text-slate-900">in real-time,</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                effortlessly
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              The most powerful collaborative workspace for modern teams. 
              Write, edit, and collaborate in real-time with zero friction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="/register" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Free Today
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="/login" 
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 text-lg font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                Watch Demo
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-medium">Free forever</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-medium">No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-medium">Setup in 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Gradient Card */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
              
              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 md:p-12">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="text-white" size={40} />
                    </div>
                    <p className="text-slate-500 font-medium">Your collaborative workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - Modern Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Real-time Collaboration */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Sync</h3>
                <p className="text-slate-600 leading-relaxed">
                  See changes instantly as your team collaborates. Live cursors, presence indicators, and seamless updates.
                </p>
              </div>
            </div>

            {/* Lightning Fast */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 leading-relaxed">
                  Optimized for speed. Experience instant load times and buttery smooth editing on any device.
                </p>
              </div>
            </div>

            {/* Enterprise Security */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Bank-level Security</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your data is encrypted end-to-end. SOC 2 compliant with enterprise-grade security protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section - Bold Numbers */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-slate-400 font-medium">Active Teams</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  2M+
                </div>
                <div className="text-slate-400 font-medium">Documents Created</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-slate-400 font-medium">Uptime</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-slate-400 font-medium">Countries</div>
              </div>
            </div>
          </div>

          {/* Additional Features - Icon Grid */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Powerful features that make collaboration effortless
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: '🔒', title: 'End-to-End Encryption', desc: 'Military-grade security' },
              { icon: '⚡', title: 'Real-time Updates', desc: 'Instant synchronization' },
              { icon: '📱', title: 'Cross-Platform', desc: 'Works everywhere' },
              { icon: '🎨', title: 'Rich Formatting', desc: 'Beautiful documents' },
              { icon: '💬', title: 'Inline Comments', desc: 'Contextual discussions' },
              { icon: '📊', title: 'Version History', desc: 'Never lose work' },
              { icon: '🔍', title: 'Smart Search', desc: 'Find anything instantly' },
              { icon: '🌐', title: 'Offline Mode', desc: 'Work anywhere' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Final CTA Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to transform your workflow?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already collaborating better with Colabo
              </p>
              <a 
                href="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 text-lg font-bold rounded-xl shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Free Today
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold text-white">Colabo</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The modern collaboration platform built for productive teams.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Colabo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}