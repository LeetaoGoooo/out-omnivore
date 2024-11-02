import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type Pocket = {
  code?: string;
  accessToken?: string;
};

type PocketStorage = BaseStorage<Pocket> & {
  store_code: (code: string) => Promise<void>;
  code: () => Promise<string | undefined>;
  store_token: (token: string) => Promise<void>;
  token: () => Promise<string | undefined>;
};

const pocketStorage = createStorage<Pocket>(
  'pocket-storage-key',
  {},
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const pocketCodeStorage: PocketStorage = {
  ...pocketStorage,
  store_code: async (code: string) => {
    await pocketStorage.set(pocket => {
      pocket.code = code;
      return pocket;
    });
  },
  code: async () => {
    const store = await pocketStorage.get();
    return store.code;
  },
  store_token: async (token: string) => {
    await pocketStorage.set(pocket => {
      pocket.accessToken = token;
      return pocket;
    });
  },
  token: async () => {
    const store = await pocketStorage.get();
    return store.accessToken;
  },
};
