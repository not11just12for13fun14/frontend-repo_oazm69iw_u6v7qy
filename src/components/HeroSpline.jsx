import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative h-[320px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden rounded-xl border border-slate-200">
      <Spline
        scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 drop-shadow-sm">HealthVeda — Smart AI-Integrated Hospital Ecosystem</h1>
        <p className="mt-2 text-slate-700 max-w-2xl drop-shadow-sm">Predictive health monitoring and decision support for admins, clinicians, and patients. Secure, responsive, and fast.</p>
      </div>
    </section>
  );
}
