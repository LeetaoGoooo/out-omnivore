import { Message, MessageType, Omnivore2PocketMessage } from '@extension/shared/lib/message/message';
import { Pocket } from '@src/api/pocket';
import { RequestFailed } from '@src/api/models/custom-expections';
import { pocketCodeStorage } from '@extension/storage/lib/impl/pocketStorage';

chrome.runtime.onMessage.addListener(
  (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    console.debug(`receive message type ${JSON.stringify(message)}, blocking: ${message.blocking}`);
    (async () => {
      switch (message.type) {
        case MessageType.POCKET_AUTH:
          try {
            const pocket = new Pocket();
            const code = await pocket.userAuth();
            await pocketCodeStorage.store_code(code);
            const redirectUri = pocket.pocketAuthUri(code);
            await chrome.tabs.create({
              url: redirectUri,
            });
          } catch (e) {
            if (e instanceof RequestFailed) {
              return;
            }
          }
          break;
        case MessageType.OMNIVORE_TO_POCKET:
          const payload = (message as Omnivore2PocketMessage).payload;
          const pocket = new Pocket();
          const token = await pocketCodeStorage.token();
          try {
            const result = await pocket.batchInsertItems(token!, payload);
          } catch (e) {
            if (e instanceof RequestFailed) {
              return;
            }
          }
          break;
      }
    })();

    return message.blocking == true;
  },
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  console.debug(`receive tab ${JSON.stringify(changeInfo)}`);
  const tabUrl = changeInfo.url;
  if (!tabUrl || tabUrl != Pocket.redirectUri) {
    return;
  }
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.POCKET_LOGGING,
    });
  } catch (e) {
    console.error(e);
  }
  const pocket = new Pocket();
  const code = await pocketCodeStorage.code();
  const userAccessTokenResponse = await pocket.fetchPocketAccessToken(code!);
  await pocketCodeStorage.store_token(userAccessTokenResponse.access_token);
  await chrome.runtime.sendMessage({
    type: MessageType.POCKET_LOGIN_SUCCESS,
  });
});
