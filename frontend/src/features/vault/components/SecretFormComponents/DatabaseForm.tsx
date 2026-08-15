import React from "react";

interface Props {
  dbEngine: string;
  setDbEngine: (v: string) => void;
  dbHost: string;
  setDbHost: (v: string) => void;
  dbPort: string;
  setDbPort: (v: string) => void;
  dbName: string;
  setDbName: (v: string) => void;
  dbUser: string;
  setDbUser: (v: string) => void;
  dbPassword: string;
  setDbPassword: (v: string) => void;
}

export function DatabaseForm({ dbEngine, setDbEngine, dbHost, setDbHost, dbPort, setDbPort, dbName, setDbName, dbUser, setDbUser, dbPassword, setDbPassword }: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg space-y-4">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">Baza danych SQL / NoSQL (Decrypted in RAM)</span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Silnik bazy</label>
          <select
            value={dbEngine}
            onChange={(e) => setDbEngine(e.target.value)}
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          >
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="MongoDB">MongoDB</option>
            <option value="Redis">Redis</option>
            <option value="MSSQL">SQL Server</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Host serwera</label>
          <input
            type="text"
            value={dbHost}
            onChange={(e) => setDbHost(e.target.value)}
            placeholder="localhost, db.domain.com"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Port połączenia</label>
          <input
            type="text"
            value={dbPort}
            onChange={(e) => setDbPort(e.target.value)}
            placeholder="5432"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Nazwa bazy danych (DB Name)</label>
          <input
            type="text"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            placeholder="production_db"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Nazwa użytkownika</label>
          <input
            type="text"
            value={dbUser}
            onChange={(e) => setDbUser(e.target.value)}
            placeholder="postgres"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Hasło do bazy danych</label>
          <input
            type="password"
            value={dbPassword}
            onChange={(e) => setDbPassword(e.target.value)}
            placeholder="Wpisz hasło SQL..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
export default DatabaseForm;
