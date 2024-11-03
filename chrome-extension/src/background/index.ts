import {
  createSnackBarMessage,
  Message,
  MessageType,
  Omnivore2PocketMessage,
  Omnivore2PocketMessagePayload,
} from '@extension/shared/lib/message/message';
import { Pocket } from '@src/api/pocket';
import { RequestFailed } from '@src/api/models/custom-expections';
import { pocketCodeStorage } from '@extension/storage/lib/impl/pocketStorage';

chrome.runtime.onMessage.addListener(
  (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    console.debug(`receive message type ${message.type}, blocking: ${message.blocking}`);
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
              await chrome.runtime.sendMessage(createSnackBarMessage('Auth Failed,please try again!', 'error'));
              return;
            }
          }
          break;
        case MessageType.OMNIVORE_TO_POCKET:
          const payload = (message as Omnivore2PocketMessage).payload;
          try {
            await batchAddFileToPockets(payload);
          } catch (e) {
            if (e instanceof RequestFailed) {
              return;
            }
          }
          console.debug(`OMNIVORE_TO_POCKET background execute finished`);
          sendResponse({ status: 'done' });
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
    await chrome.runtime.sendMessage(createSnackBarMessage('Logging...', 'info'));
  } catch (e) {
    console.error(e);
  }
  const pocket = new Pocket();
  const code = await pocketCodeStorage.code();
  try {
    const userAccessTokenResponse = await pocket.fetchPocketAccessToken(code!);
    await pocketCodeStorage.store_token(userAccessTokenResponse.access_token);
    await chrome.tabs.remove(tabId);
    await chrome.runtime.sendMessage({
      type: MessageType.POCKET_LOGIN_SUCCESS,
    });
    await chrome.runtime.sendMessage(createSnackBarMessage('Login Successfully!', 'success'));
  } catch (e) {
    // @ts-ignore
    await chrome.runtime.sendMessage(createSnackBarMessage(`Login Failed,error:${e.toString()}`, 'error'));
  }
});

async function batchAddFileToPockets(payload: Omnivore2PocketMessagePayload) {
  const pocket = new Pocket();
  const token = await pocketCodeStorage.token();
  const total = payload.total;
  const filename = payload.filename;
  const finished = payload.finished;

  try {
    const omnivoreItems = payload.items;
    const items = omnivoreItems.map(item => item.url);
    try {
      await chrome.runtime.sendMessage({
        type: MessageType.ADD_TO_POCKET_PROCESS,
        payload: {
          filename: filename,
          status: 'doing',
          finished: finished,
          total: total,
          items: items,
        },
      });
    } catch (e) {
      console.error(e);
    }
    const pocketItem = omnivoreItems.map(item => {
      return {
        url: item.url,
        title: item.title,
        action: 'add',
      };
    });
    const response = await pocket.batchInsertItems(token!, pocketItem);
    const itemStatus = response.action_results;
    try {
      await chrome.runtime.sendMessage({
        type: MessageType.ADD_TO_POCKET_PROCESS,
        payload: {
          filename: filename,
          status: 'done',
          finished: finished + 1,
          total: total,
          items: items,
          itemStatus: itemStatus,
        },
      });
    } catch (e) {
      // @ts-ignore
      console.error(`ADD_TO_POCKET_PROCESS: ${e.toString()}`);
    }
  } catch (e) {
    // @ts-ignore
    await chrome.runtime.sendMessage(
      createSnackBarMessage(`Process ${filename} Add  Items to Pocket Failed, e: ${e.toString()}`, 'error'),
    );
  }
}
