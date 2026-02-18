import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { label: 'Início', href: 'Home' },
    { label: 'Serviços', href: 'Templates' },
    { label: 'Sobre', href: 'About' },
    { label: 'Contato', href: 'Contact' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-[var(--brand-primary)]" />
            <span className="font-bold text-xl">LegalFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.label}
                to={createPageUrl(link.href)}
                className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
}