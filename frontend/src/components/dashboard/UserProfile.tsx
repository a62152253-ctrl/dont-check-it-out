import React from "react";

export default function UserProfile({ profile }: { profile: any }) {
  return (
    <div className="hidden sm:flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg hover:border-white/10 transition-colors">
      <img
        src={profile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`}
        alt="User avatar"
        referrerPolicy="no-referrer"
        className="w-6 h-6 rounded bg-slate-800 border border-white/10 shrink-0"
      />
      <span className="text-xs font-mono text-slate-300 max-w-[150px] truncate">
        {profile.displayName || profile.email}
      </span>
    </div>
  );
}