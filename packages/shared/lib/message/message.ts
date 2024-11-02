import { VariantType } from 'notistack';

export enum MessageType {
  POCKET_AUTH = 'POCKET_AUTH',
  POCKET_LOGGING = 'POCKET_LOGGING',
  POCKET_LOGIN_SUCCESS = 'POCKET_LOGIN_SUCCESS',
  OMNIVORE_TO_POCKET = 'OMNIVORE_TO_POCKET',
  SNACKBAR_MESSAGE = 'SNACKBAR_MESSAGE',
}

interface MessageBase {
  type: MessageType;
  blocking?: boolean;
}

export type PocketAuthMessage = {
  type: MessageType.POCKET_AUTH;
};

export type OmnivoreItem = {
  url: string;
  title: string;
};

export type Omnivore2PocketMessage = {
  type: MessageType.OMNIVORE_TO_POCKET;
  payload: OmnivoreItem[];
};

export const createOmnivore2PocketMessage = (payload: OmnivoreItem[]) => ({
  type: MessageType.OMNIVORE_TO_POCKET,
  payload: payload,
});

export type SnackBarMessage = {
  type: MessageType.SNACKBAR_MESSAGE;
  payload: string;
  variantType: VariantType;
};

export const createSnackBarMessage = (text: string, variantType?: VariantType) => ({
  type: MessageType.SNACKBAR_MESSAGE,
  payload: text,
  variantType: variantType,
});

export type Message = (PocketAuthMessage | Omnivore2PocketMessage | SnackBarMessage) & MessageBase;
