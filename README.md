# CipherVault SaaS Monorepo Workspace

An enterprise-ready SaaS repository structure dividing application components, backend rules, and shareable models.

## Repository Layout

```
authentication-portal/
├── backend/
│   ├── firebase/
│   │   ├── firestore.rules             # Access security rules
│   │   ├── firebase-blueprint.json     # Firestore schemas & indexes
│   │   └── firebase-applet-config.json # Applet deploy variables
│   └── package.json                    # Backend project metadata
├── frontend/
│   ├── src/                            # React core client code
│   │   ├── components/                 # MainForm, SaaSDashboard
│   │   ├── features/vault/             # Zero-knowledge cipher vault feature boundary
│   │   ├── hooks/                      # Shared auth hooks
│   │   ├── lib/                        # Firebase SDK wrappers, Translations
│   │   └── main.tsx                    # Client boot entrypoint
│   ├── index.html                      # HTML root template
│   ├── package.json                    # Frontend dependencies & Vite scripts
│   ├── tsconfig.json                   # UI typescript rules
│   └── vite.config.ts                  # Vite build options
├── shared/
│   ├── types/
│   │   └── index.ts                    # Shared types (UserProfile, DecryptedSecret)
│   └── package.json                    # Shared package declarations
├── package.json                        # Root monorepo workspace configurations
└── README.md                           # This workspace guide
```

## Quick Start

### 1. Install dependencies
Run the master installer from the root workspace directory to hook and link all workspace modules (front-end, back-end, shared) together:
```bash
npm run install:all
```

### 2. Start Dev Server
Spin up the local developer preview:
```bash
npm run dev:frontend
```

### 3. Build & Compile Checks
Verify typings compile clean with no compile errors:
```bash
npm run lint:frontend
npm run build:frontend
```
