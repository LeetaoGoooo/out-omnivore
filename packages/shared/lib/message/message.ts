export enum MessageType {
  POCKET_AUTH = 'POCKET_AUTH',
  POCKET_LOGGING = 'POCKET_LOGGING',
  POCKET_LOGIN_SUCCESS = 'POCKET_LOGIN_SUCCESS',
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

export type Omnivore2PocketMessage = {
  type: MessageType.OMNIVORE_TO_POCKET;
  payload: OmnivoreItem[];
};

export const createOmnivore2PocketMessage = (payload: OmnivoreItem[]) => ({
  type: MessageType.OMNIVORE_TO_POCKET,
  payload: payload,
});

export type Message = (PocketAuthMessage | Omnivore2PocketMessage) & MessageBase;
