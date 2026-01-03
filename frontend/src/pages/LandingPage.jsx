import { Shield, Zap, Users, MessageSquare, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-gray-900">Willow<span className="text-green-600 text-3xl">.</span></div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
        </div>
        <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700">
          Get Started
        </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-16 md:py-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          <span className="block">Willow<span className="text-green-600 text-3xl md:text-4xl lg:text-5xl">.</span></span>
          <span className="block">Safe chat starts here<span className="text-green-600 text-3xl md:text-4xl lg:text-5xl">.</span></span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Real-time AI moderation that detects toxic content and suggests polite alternatives. 
          Keep your conversations safe and professional with intelligent content filtering.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 flex items-center justify-center min-w-[140px]">
            Try Now →
          </Link>
          <a href="https://youtu.be/zHzSBQuv7fI" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 min-w-[140px] text-center">
            Watch Demo
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful moderation features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Real-time Detection</h3>
              <p className="text-gray-600">Instantly flags toxic, abusive, and inappropriate content as messages are sent</p>
            </div>
            <div className="text-center p-6">
              <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Rephrasing</h3>
              <p className="text-gray-600">AI suggests polite alternatives that preserve meaning while removing harmful tone</p>
            </div>
            <div className="text-center p-6 sm:col-span-2 lg:col-span-1">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Low Latency</h3>
              <p className="text-gray-600">Ultra-fast processing keeps chat flow smooth and uninterrupted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Don't just take our word.
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Hear what our users say about us. We're always looking for ways to improve.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "Willow helped us reduce abusive messages drastically within the first week. The real-time AI suggestions keep conversations professional without hurting user experience."
              </p>
              <div className="flex items-center">
                <img src="/ananya.jpeg" alt="Ananya Sharma" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Ananya Sharma</div>
                  <div className="text-gray-600 text-sm">Community Manager, EdTech Startup (India)</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "The real-time moderation is extremely fast and reliable. We handle thousands of messages daily, and Willow works seamlessly without any noticeable latency or performance drop."
              </p>
              <div className="flex items-center">
                <img src="/rahul.jpeg" alt="Rahul Verma" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Rahul Verma</div>
                  <div className="text-gray-600 text-sm">Head of Platform Safety, FinTech Company</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border sm:col-span-2 lg:col-span-1">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "What I love most about Willow is how it improves tone instead of just blocking messages. It helps users communicate better while keeping conversations natural."
              </p>
              <div className="flex items-center">
                <img src="/martha.jpg" alt="Martha Neilsen" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Martha Neilsen</div>
                  <div className="text-gray-600 text-sm">Product Manager, SaaS Collaboration Platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer id="about" />
    </div>
  );
};

export default LandingPage;