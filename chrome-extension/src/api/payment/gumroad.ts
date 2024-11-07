export type VerifyLicensePurchase = {
  quantity: number;
  ip_country: string;
  order_number: string;
};
export type VerifyLicenseResponse = {
  success: boolean;
  uses: number;
  purchase: VerifyLicensePurchase;
};

class Gumroad {
  productId = '';

  async verifyLicense(license_key: string) {
    const url = 'https://api.gumroad.com/v2/licenses/verify';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        product_id: this.productId,
        license_key: license_key,
      }),
    });

    const result = (await response.json()) as VerifyLicenseResponse;
    return result.success && result.purchase != null;
  }
}
