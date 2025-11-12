'use client';
import { useEffect } from 'react';

export default function IdentityWidget() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, []);
  return null;
}
