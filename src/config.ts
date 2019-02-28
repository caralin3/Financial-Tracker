import { CompileTimeConfiguration } from "./types/configuration";

const config: CompileTimeConfiguration = {
  env: process.env.NODE_ENV,
  firebaseApiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  firebaseDatabaseUrl: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  firebaseMsgSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  firebaseProjectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

export default config;
