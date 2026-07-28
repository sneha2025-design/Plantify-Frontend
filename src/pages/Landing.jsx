import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const Landing = () => {
  const featuredPlants = [
    { id: 1, name: 'Monstera Deliciosa', price: '$45.00', category: 'Indoor', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { id: 2, name: 'Snake Plant (Laurentii)', price: '$28.00', category: 'Low Light', image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { id: 3, name: 'Fiddle Leaf Fig', price: '$65.00', category: 'Indoor', image: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-550 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-dark-800/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-slate-800 dark:text-dark-50">
            <span className="text-primary-600 dark:text-primary-400">🌿</span>
            <span className="font-sans">Plantify</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4.5 py-2 rounded-lg shadow-sm active:scale-95 transition-all">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 flex-1">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-full text-xs font-bold border border-primary-100 dark:border-primary-900/50">
              <Leaf size={14} />
              <span>Bring nature into your workspace</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-dark-50 leading-[1.1]">
              Elevate Your Space with <span className="text-primary-600 dark:text-primary-400">Vibrant Plants</span>
            </h1>
            
            <p className="text-slate-500 dark:text-dark-400 text-base sm:text-lg leading-relaxed max-w-lg">
              Plantify is your premium e-commerce destination for buying healthy, lush, hand-delivered indoor and outdoor plants. Experience verified ordering, real-time care guides, and secure payments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all">
                <span>Shop Catalog</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="border border-slate-300 dark:border-dark-850 hover:bg-slate-100 dark:hover:bg-dark-900 text-slate-700 dark:text-dark-200 font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
                Verify Credentials
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            {/* Visual leaf graphic frame */}
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                alt="Plant display"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Hand Picked</span>
                <h4 className="text-lg font-bold">Fiddle Leaf Fig Premium</h4>
                <p className="text-sm text-slate-200">Fresh organic growth, hand-delivered.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-white dark:bg-dark-900 border-y border-slate-200/50 dark:border-dark-800/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-dark-50">Best Sellers</h2>
            <p className="text-slate-400 dark:text-dark-500 max-w-md mx-auto text-sm">
              Check out our most popular plant selections requested by home designers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredPlants.map((plant) => (
              <div key={plant.id} className="bg-slate-50 dark:bg-dark-950 border border-slate-200/60 dark:border-dark-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md p-1.5 rounded-full text-slate-500 hover:text-red-500 cursor-pointer shadow-sm transition-colors">
                    <Heart size={16} />
                  </div>
                </div>
                <div className="p-5 text-left flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-400 dark:text-dark-500 font-semibold">{plant.category}</span>
                    <h3 className="font-bold text-slate-800 dark:text-dark-100 text-base mt-0.5">{plant.name}</h3>
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 font-extrabold text-base">
                    {plant.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Credentials Banner */}
      <section className="py-16 bg-slate-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 space-y-3 bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-dark-800/40">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-dark-100">JWT Token Security</h3>
            <p className="text-xs text-slate-400 dark:text-dark-500 leading-relaxed">
              Standard payload security with rotated refresh tokens and locked browser session cookies.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-3 bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-dark-800/40">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shadow-inner">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-dark-100">Email Verification</h3>
            <p className="text-xs text-slate-400 dark:text-dark-500 leading-relaxed">
              Dual-stage login check verifying active users via Gmail SMTP OTP challenges.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-3 bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-dark-800/40">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shadow-inner">
              <Leaf size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-dark-100">Premium Growth</h3>
            <p className="text-xs text-slate-400 dark:text-dark-500 leading-relaxed">
              Enjoy custom recommendations, ordering status trackers, and member discounts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
            <span>🌿</span>
            <span>Plantify</span>
          </div>
          <div>
            &copy; 2026 Plantify Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
