import { VariantType } from 'notistack';

export enum MessageType {
  POCKET_AUTH = 'POCKET_AUTH',
  POCKET_LOGGING = 'POCKET_LOGGING',
  POCKET_LOGIN_SUCCESS = 'POCKET_LOGIN_SUCCESS',
  SNACKBAR_MESSAGE = 'SNACKBAR_MESSAGE',
  UPLOAD_FILES = 'UPLOAD_FILES',
  ADD_TO_POCKET_PROCESS = 'ADD_TO_POCKET_PROCESS',
  OMNIVORE_TO_POCKET = 'OMNIVORE_TO_POCKET',
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

export type Omnivore2PocketMessagePayload = {
  total: number;
  items: OmnivoreItem[];
};

export type Omnivore2PocketMessage = {
  type: MessageType.OMNIVORE_TO_POCKET;
  payload: Omnivore2PocketMessagePayload;
};

export const createOmnivore2PocketMessage = (payload: Omnivore2PocketMessagePayload) => ({
  type: MessageType.OMNIVORE_TO_POCKET,
  payload: payload,
  blocking: true,
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

export type UploadFilesMessage = {
  type: MessageType.UPLOAD_FILES;
  payload: File[];
};

export const createUploadFileMessage = (files: File[]) => ({
  type: MessageType.UPLOAD_FILES,
  payload: files,
});

export interface UploadItemProperty {
  filename: string;
  status: string;
  finished: number;
  total: number;
  items: string[];
  itemStatus?: boolean[];
}

export type AddFileToPocketProcessMessage = {
  type: MessageType.ADD_TO_POCKET_PROCESS;
  payload: UploadItemProperty;
};

export const createAddFileToPocketProcessMessage = (payload: UploadItemProperty) => ({
  type: MessageType.ADD_TO_POCKET_PROCESS,
  payload: payload,
});

export type Message = (
  | PocketAuthMessage
  | SnackBarMessage
  | UploadFilesMessage
  | AddFileToPocketProcessMessage
  | Omnivore2PocketMessage
) &
  MessageBase;
