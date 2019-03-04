export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production';
  REACT_APP_FIREBASE_API_KEY: string;
  REACT_APP_FIREBASE_AUTH_DOMAIN: string;
  REACT_APP_FIREBASE_DATABASE_URL: string;
  REACT_APP_FIREBASE_MESSAGE_SENDER_ID: string;
  REACT_APP_FIREBASE_PROJECT_ID: string;
  REACT_APP_FIREBASE_STORAGE_BUCKET: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

export interface CommonConfiguration {
  env: 'development' | 'production';
  firebaseApiKey: string | undefined;
  firebaseAuthDomain: string | undefined;
  firebaseDatabaseUrl: string | undefined;
  firebaseMsgSenderId: string | undefined;
  firebaseProjectId: string | undefined;
  firebaseStorageBucket: string | undefined;
}

export interface CompileTimeConfiguration extends CommonConfiguration {}

export interface RuntimeConfiguration
  extends Pick<CommonConfiguration, 'env'> {}
