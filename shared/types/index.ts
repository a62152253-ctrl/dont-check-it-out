export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  role: string;
  plan: string;
  companyName?: string;
  onboardingCompleted: boolean;
  status: 'Active' | 'Suspended' | 'Pending';
}

export interface UserActivity {
  id?: string;
  uid: string;
  action: string;
  timestamp: string;
  userAgent: string;
  status: 'Success' | 'Failed';
  details?: string;
}

export interface DeveloperFields {
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  region?: string;
  dbHost?: string;
  dbPort?: string;
  dbUser?: string;
  dbPassword?: string;
  dbName?: string;
  dbEngine?: string;
  sshPrivateKey?: string;
  sshPassphrase?: string;
  sshHost?: string;
  dotenvContent?: string;
}

export interface DecryptedSecret {
  id?: string;
  name: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  project?: string;
  environment?: string;
  developerFields?: DeveloperFields;
  category: string;
  isFavorite?: boolean;
  isTrash?: boolean;
  isLegacy?: boolean;
  isCorrupted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
