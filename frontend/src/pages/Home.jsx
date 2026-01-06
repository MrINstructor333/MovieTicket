import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Film, 
  Play, 
  Clock, 
  Star, 
  ArrowRight, 
  Ticket,
  Sparkles,
  Calendar
} from 'lucide-react';
import { movieService } from '../api/services';
import MovieGrid from '../components/movies/MovieGrid';
import { Button, GlassCard, BentoGrid, BentoItem } from '../components/ui';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nowShowingRes, upcomingRes] = await Promise.all([
          movieService.getNowShowing(),
          movieService.getUpcoming(),
        ]);
        
        // Handle paginated response format
        const nowShowingMovies = nowShowingRes.results || nowShowingRes || [];
        const upcomingMovies = upcomingRes.results || upcomingRes || [];
        
        setNowShowing(nowShowingMovies);
        setUpcoming(upcomingMovies);
        
        // Set featured movie from now showing or any available
        if (nowShowingMovies.length > 0) {
          setFeaturedMovie(nowShowingMovies[0]);
        } else if (upcomingMovies.length > 0) {
          setFeaturedMovie(upcomingMovies[0]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Try to fetch all movies as fallback
        try {
          const allMoviesRes = await movieService.getAll();
          const allMovies = allMoviesRes.results || allMoviesRes || [];
          setNowShowing(allMovies.slice(0, 6));
          setUpcoming(allMovies.slice(6, 12));
          if (allMovies.length > 0) {
            setFeaturedMovie(allMovies[0]);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {(featuredMovie?.poster_url || featuredMovie?.poster) && (
            <img
              src={featuredMovie.poster_url || `http://localhost:8000${featuredMovie.poster}`}
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/50" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm font-medium border border-accent-cyan/30">
                <Sparkles className="w-4 h-4" />
                Premium Cinema Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="text-white">Experience </span>
              <span className="gradient-text">Cinema</span>
              <br />
              <span className="text-white">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Book your tickets instantly and enjoy the latest blockbusters 
              in stunning quality. Your perfect seat awaits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/movies">
                <Button variant="clay" size="lg" icon={Film}>
                  Browse Movies
                </Button>
              </Link>
              {featuredMovie && (
                <Link to={`/movies/${featuredMovie.id}`}>
                  <Button variant="glass" size="lg" icon={Play}>
                    Watch Trailer
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-8"
            >
              {[
                { value: '50+', label: 'Movies' },
                { value: '10+', label: 'Theaters' },
                { value: '1000+', label: 'Happy Customers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Featured Movie Card */}
          {featuredMovie && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent-cyan rounded-3xl blur-2xl opacity-30" />
                <Link to={`/movies/${featuredMovie.id}`}>
                  <GlassCard className="p-0 overflow-hidden">
                    <img
                      src={featuredMovie.poster_url || `http://localhost:8000${featuredMovie.poster}`}
                      alt={featuredMovie.title}
                      className="w-72 h-96 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-bold text-white">{featuredMovie.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredMovie.duration} min
                        </span>
                        {featuredMovie.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {featuredMovie.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Why Choose</span>
            <span className="text-white"> CinemaHub?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We offer the best cinema experience with cutting-edge technology and premium comfort.
          </p>
        </motion.div>

        <BentoGrid>
          <BentoItem span={2} className="bg-gradient-to-br from-primary/20 to-accent-cyan/10">
            <div className="h-full flex flex-col justify-between">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Ticket className="w-7 h-7 text-accent-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Booking</h3>
                <p className="text-gray-400">
                  Book your tickets in seconds with our lightning-fast booking system. 
                  No queues, no waiting.
                </p>
              </div>
            </div>
          </BentoItem>

          <BentoItem className="bg-gradient-to-br from-accent-purple/20 to-primary/10">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">VIP Seats</h3>
            <p className="text-gray-400 text-sm">Premium comfort guaranteed</p>
          </BentoItem>

          <BentoItem className="bg-gradient-to-br from-green-500/20 to-accent-cyan/10">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Easy Scheduling</h3>
            <p className="text-gray-400 text-sm">Pick your perfect showtime</p>
          </BentoItem>

          <BentoItem span={2} rowSpan={1}>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shrink-0">
                <Film className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Latest Blockbusters</h3>
                <p className="text-gray-400">
                  Get access to the newest releases as soon as they hit the screens. 
                  Never miss a premiere.
                </p>
              </div>
            </div>
          </BentoItem>

          <BentoItem span={2}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Payments</h3>
                <p className="text-gray-400 mb-4">
                  Multiple payment options including mobile money, cards, and more. 
                  Your transactions are always safe.
                </p>
              </div>
              <div className="flex gap-3">
                {['M-Pesa', 'Visa', 'MasterCard', 'Tigo Pesa'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 text-sm border border-white/10"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </BentoItem>
        </BentoGrid>
      </section>

      {/* Now Showing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Now Showing</h2>
            <p className="text-gray-400 mt-2">Don't miss these amazing movies</p>
          </div>
          <Link to="/movies?status=NOW_SHOWING">
            <Button variant="ghost" icon={ArrowRight} iconPosition="right">
              View All
            </Button>
          </Link>
        </div>
        <MovieGrid movies={nowShowing.slice(0, 4)} loading={loading} />
      </section>

      {/* Coming Soon */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Coming Soon</h2>
            <p className="text-gray-400 mt-2">Get excited for these upcoming releases</p>
          </div>
          <Link to="/movies?status=COMING_SOON">
            <Button variant="ghost" icon={ArrowRight} iconPosition="right">
              View All
            </Button>
          </Link>
        </div>
        <MovieGrid movies={upcoming.slice(0, 4)} loading={loading} />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent-cyan to-accent-purple rounded-3xl blur-2xl opacity-20" />
            <div className="relative clay-card p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for Your Next Movie Night?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of movie lovers who trust CinemaHub for their perfect cinema experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button variant="clay" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/movies">
                  <Button variant="glass" size="lg">
                    Browse Movies
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
