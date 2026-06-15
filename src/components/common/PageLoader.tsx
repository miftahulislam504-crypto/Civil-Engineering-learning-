export default function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo mark */}
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <span className="font-display font-bold text-white text-lg">E</span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 blur-lg opacity-40 animate-pulse-slow" />
        </div>
        {/* Spinner */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <p className="text-slate-500 text-sm font-body">লোড হচ্ছে...</p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
