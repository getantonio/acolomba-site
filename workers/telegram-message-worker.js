const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

async function sendTelegramJson(env, method, payload) {
  return fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function sendTelegramForm(env, method, payload) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  return fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    body: formData,
  });
}

function attachmentMethod(file) {
  if (!file || !file.size) {
    return null;
  }

  if (file.type.startsWith("image/")) {
    return { method: "sendPhoto", field: "photo" };
  }

  if (file.type.startsWith("audio/")) {
    return { method: "sendAudio", field: "audio" };
  }

  return null;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return json({ error: "Telegram delivery is not configured" }, 500);
    }

    let body;
    let attachment = null;
    try {
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
        const file = formData.get("attachment");

        if (file instanceof File && file.size > 0) {
          attachment = file;
        }
      } else {
        body = await request.json();
      }
    } catch {
      return json({ error: "Invalid message payload" }, 400);
    }

    const name = clean(body.name, 120);
    const replyTo = clean(body.replyTo, 180);
    const message = clean(body.message, 2500);
    const page = clean(body.page, 300);

    if (!name || !replyTo || !message) {
      return json({ error: "Name, reply contact, and message are required" }, 400);
    }

    if (attachment && attachment.size > 15 * 1024 * 1024) {
      return json({ error: "Attachment is too large" }, 413);
    }

    const text = [
      "New site message",
      "",
      `Name: ${name}`,
      `Reply: ${replyTo}`,
      page ? `Page: ${page}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    let telegramResponse;
    const media = attachmentMethod(attachment);

    if (media && text.length <= 1000) {
      telegramResponse = await sendTelegramForm(env, media.method, {
        chat_id: env.TELEGRAM_CHAT_ID,
        caption: text,
        [media.field]: attachment,
      });
    } else {
      telegramResponse = await sendTelegramJson(env, "sendMessage", {
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      });

      if (telegramResponse.ok && media) {
        telegramResponse = await sendTelegramForm(env, media.method, {
          chat_id: env.TELEGRAM_CHAT_ID,
          caption: `Attachment from ${name}`,
          [media.field]: attachment,
        });
      }
    }

    if (!telegramResponse.ok) {
      return json({ error: "Telegram rejected the message" }, 502);
    }

    return json({ ok: true });
  },
};
