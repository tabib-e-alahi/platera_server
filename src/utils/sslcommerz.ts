// src/utils/sslcommerz.ts

import axios from "axios";
import envConfig from "../config/index";

const SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const LIVE_URL    = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

const VALIDATE_SANDBOX = "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
const VALIDATE_LIVE    = "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

export interface ISSLInitPayload {
  total_amount: number;
  currency: string;
  tran_id: string;          // your unique transaction id
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  product_name: string;
  product_category: string;
  product_profile: string;  // "general"
  ship_name?: string;
  ship_add1?: string;
  ship_city?: string;
  ship_country?: string;
}

export interface ISSLInitResponse {
  status: string;           // "SUCCESS" | "FAILED"
  failedreason?: string;
  GatewayPageURL?: string;
  sessionkey?: string;
  desc?: string;
}

// ─── Initiate a payment session with SSLCommerz ───────────────────────────────

export const initSSLSession = async (
  payload: ISSLInitPayload
): Promise<ISSLInitResponse> => {
  const url = envConfig.SSLCOMMERZ_IS_LIVE ? LIVE_URL : SANDBOX_URL;

  const params = new URLSearchParams({
    store_id:   envConfig.SSLCOMMERZ_STORE_ID,
    store_passwd: envConfig.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: String(payload.total_amount),
    currency:   payload.currency,
    tran_id:    payload.tran_id,
    success_url: payload.success_url,
    fail_url:   payload.fail_url,
    cancel_url: payload.cancel_url,
    ipn_url:    payload.ipn_url,
    cus_name:   payload.cus_name,
    cus_email:  payload.cus_email,
    cus_phone:  payload.cus_phone,
    cus_add1:   payload.cus_add1,
    cus_city:   payload.cus_city,
    cus_country: payload.cus_country,
    product_name: payload.product_name,
    product_category: payload.product_category,
    product_profile: payload.product_profile,
    ship_name:  payload.ship_name ?? payload.cus_name,
    ship_add1:  payload.ship_add1 ?? payload.cus_add1,
    ship_city:  payload.ship_city ?? payload.cus_city,
    ship_country: payload.ship_country ?? payload.cus_country,
  });

  const res = await axios.post(url, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 15000,
  });

  return res.data as ISSLInitResponse;
};

// ─── Validate an IPN / callback hit ──────────────────────────────────────────

export const validateSSLPayment = async (
  val_id: string
): Promise<any> => {
  const url = envConfig.SSLCOMMERZ_IS_LIVE
    ? VALIDATE_LIVE
    : VALIDATE_SANDBOX;

  const res = await axios.get(url, {
    params: {
      val_id,
      store_id:     envConfig.SSLCOMMERZ_STORE_ID,
      store_passwd: envConfig.SSLCOMMERZ_STORE_PASSWORD,
      v:  1,
      format: "json",
    },
    timeout: 15000,
  });

  return res.data;
};