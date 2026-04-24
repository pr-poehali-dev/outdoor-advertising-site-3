import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта Визуал ПРО на почту vizualpro39@mail.ru"""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Имя и телефон обязательны"}),
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "vizualpro39@mail.ru"
    to_email = "vizualpro39@mail.ru"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
      <div style="background: #FFE500; color: #0a0a0a; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.05em;">НОВАЯ ЗАЯВКА — ВИЗУАЛ ПРО</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; color: #888; font-size: 13px; width: 120px; vertical-align: top;">Имя:</td>
          <td style="padding: 12px 0; color: #ffffff; font-size: 15px; font-weight: 600;">{name}</td>
        </tr>
        <tr style="border-top: 1px solid #222;">
          <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Телефон:</td>
          <td style="padding: 12px 0; color: #FFE500; font-size: 15px; font-weight: 600;">{phone}</td>
        </tr>
        {"<tr style='border-top: 1px solid #222;'><td style='padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;'>Сообщение:</td><td style='padding: 12px 0; color: #cccccc; font-size: 14px; line-height: 1.6;'>" + message + "</td></tr>" if message else ""}
      </table>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #222; color: #555; font-size: 12px;">
        Заявка отправлена с сайта Визуал ПРО
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка с сайта: {name} — {phone}"
    msg["From"] = from_email
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}),
    }
