/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONSUMER_KEY: string;
  readonly VITE_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
