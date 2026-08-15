import React from "react";

interface Props {
  awsAccessKeyId: string;
  setAwsAccessKeyId: (v: string) => void;
  awsSecretAccessKey: string;
  setAwsSecretAccessKey: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
}

export function AWSForm({ awsAccessKeyId, setAwsAccessKeyId, awsSecretAccessKey, setAwsSecretAccessKey, region, setRegion }: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg space-y-4">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">AWS Identity & Access Credentials</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">AWS Access Key ID</label>
          <input
            type="text"
            value={awsAccessKeyId}
            onChange={(e) => setAwsAccessKeyId(e.target.value)}
            placeholder="AKIA..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">AWS Secret Access Key</label>
          <input
            type="password"
            value={awsSecretAccessKey}
            onChange={(e) => setAwsSecretAccessKey(e.target.value)}
            placeholder="Wpisz klucz tajny AWS..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">AWS Default Region</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="us-east-1"
          className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
        />
      </div>
    </div>
  );
}
export default AWSForm;
