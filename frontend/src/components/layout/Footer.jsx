import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-900/50 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">CinemaHub</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premier destination for movie tickets. Experience cinema like never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Movies', 'Theaters', 'Coming Soon', 'Offers'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-accent-cyan transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-gray-400 hover:text-accent-cyan transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: 'mailto:contact@cinemahub.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center
                             text-gray-400 hover:text-accent-cyan hover:bg-white/10 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 CinemaHub. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for DIT
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
