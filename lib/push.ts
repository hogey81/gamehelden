import webpush from "web-push";

// Server-only. Generate the keys once with `npx web-push generate-vapid-keys`.
let ready: boolean | undefined;
function setup(): boolean {
  if (ready === undefined) {
    const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const priv = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT ?? "mailto:info@gamehelden.nl";
    if (pub && priv) webpush.setVapidDetails(subject, pub, priv);
    ready = !!(pub && priv);
  }
  return ready;
}

export const pushConfigured = setup;

export type Sub = { endpoint: string; p256dh: string; auth: string };

export type PushMessage = {
  kind: "live" | "video" | "test";
  title: string;
  body: string;
  icon?: string | null;
  image?: string | null;
  url: string;
  tag?: string;
  timestamp?: number;
};

// "gone" means the visitor revoked permission or the browser dropped the subscription.
export async function sendPush(sub: Sub, msg: PushMessage): Promise<"ok" | "gone" | "error"> {
  if (!setup()) return "error";
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(msg),
      { TTL: msg.kind === "live" ? 1800 : 86400, urgency: msg.kind === "live" ? "high" : "normal" },
    );
    return "ok";
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    return status === 404 || status === 410 ? "gone" : "error";
  }
}
