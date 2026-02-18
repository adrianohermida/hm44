import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderNav({ links, mobile = false }) {
  const baseClass = mobile 
    ? "block py-3 text-[var(--text-primary)] hover:text-[var(--brand-primary)] font-medium transition-colors border-b border-[var(--border-primary)] last:border-0"
    : "text-sm font-medium text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors";

  const handleClick = (e, link) => {
    if (link.anchor) {
      e.preventDefault();
      if (window.location.pathname.includes('Home')) {
        const element = document.querySelector(link.anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = link.to + link.anchor;
      }
    }
  };

  return (
    <nav className={mobile ? "space-y-0" : "hidden lg:flex items-center gap-6"} aria-label={mobile ? "Menu móvel" : "Menu principal"}>
      {links.map((link, i) => (
        <Link 
          key={i} 
          to={link.to + (link.anchor || '')} 
          className={baseClass} 
          aria-label={link.label}
          onClick={(e) => handleClick(e, link)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}