export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+8615867556215";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "nicolesuntn@gmail.com";

export function getWhatsappLink(message?: string): string {
  const encoded = encodeURIComponent(
    message ?? "Hello, I am interested in your woven garment products."
  );

  const number = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encoded}`;
}
