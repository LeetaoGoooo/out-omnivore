import { PocketItemAdd, PocketSendResponse, UserAccessTokenResponse, UserAuthResponse } from '@src/api/models/models';
import { RequestFailed } from '@src/api/models/custom-expections';

export class Pocket {
  consumerKey = import.meta.env.VITE_CONSUMER_KEY;
  static redirectUri = import.meta.env.VITE_REDIRECT_URI;

  async userAuth() {
    const url = 'https://getpocket.com/v3/oauth/request';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        redirect_uri: Pocket.redirectUri,
      }),
    });
    if (!response || !response.ok) {
      throw new RequestFailed();
    }
    const responseJson = (await response.json()) as UserAuthResponse;
    return responseJson.code;
  }

  pocketAuthUri(code: string) {
    return `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${Pocket.redirectUri}`;
  }

  async fetchPocketAccessToken(code: string) {
    const url = 'https://getpocket.com/v3/oauth/authorize';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        code: code,
      }),
    });
    if (!response || !response.ok) {
      throw new RequestFailed();
    }
    return (await response.json()) as UserAccessTokenResponse;
  }

  async batchInsertItems(token: string, items: PocketItemAdd[]) {
    const url = `https://getpocket.com/v3/send`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        access_token: token,
        actions: items,
      }),
    });
    if (!response || !response.ok) {
      throw new RequestFailed();
    }
    return (await response.json()) as PocketSendResponse;
  }
}
