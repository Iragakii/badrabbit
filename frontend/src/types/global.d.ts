declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_NFT_STORAGE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
