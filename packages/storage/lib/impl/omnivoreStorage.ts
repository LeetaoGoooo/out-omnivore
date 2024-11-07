import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
type Omnivore = string[];

type OmnivoreStorage = BaseStorage<Omnivore> & {
  clear(): Promise<void>;
  setOmnivores(omnivores: string[]): Promise<void>;
  pushOmnivore(omnivores: string[]): Promise<void>;
};

const omnvioreStorage = createStorage<Omnivore>('omnviore-storage-key', [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const importStorage: OmnivoreStorage = {
  ...omnvioreStorage,
  clear: async () => {
    await omnvioreStorage.set([]);
  },
  setOmnivores: async (omnivore: Omnivore) => {
    await omnvioreStorage.set(omnivore);
  },
  pushOmnivore: async (omnivore: Omnivore) => {
    const storageOmnivore = await omnvioreStorage.get();
    await omnvioreStorage.set([...storageOmnivore, ...omnivore]);
  },
};
