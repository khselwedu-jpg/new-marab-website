import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

function getSetting(
  settings: { key: string; valueAr: string | null; valueEn: string | null }[],
  key: string,
  fallback = ""
) {
  const row = settings.find((s) => s.key === key);
  if (!row) return fallback;
  return row.valueAr ?? row.valueEn ?? fallback;
}

export function WhatsAppButton() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { data: settings = [] } = trpc.content.settings.useQuery();

  // Try whatsapp setting first, then fall back to phone_main
  const whatsapp = getSetting(settings, "social_whatsapp", "");
  const phone = getSetting(settings, "phone_main", "");

  // Build the WhatsApp number: strip non-digits, remove leading 00 or +
  const rawNumber = (whatsapp || phone).replace(/[\s\-()]/g, "");
  const waNumber = rawNumber.startsWith("+")
    ? rawNumber.slice(1)
    : rawNumber.startsWith("00")
    ? rawNumber.slice(2)
    : rawNumber;

  if (!waNumber) return null;

  const message = isAr
    ? "مرحباً، أود الاستفسار عن خدمات التأمين"
    : "Hello, I would like to inquire about insurance services";

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  const tooltip = isAr ? "تواصل معنا على واتساب" : "Chat with us on WhatsApp";

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tooltip}
      title={tooltip}
      className="fixed bottom-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group"
      style={{
        backgroundColor: "#25D366",
        right: isAr ? "auto" : "1.5rem",
        left: isAr ? "1.5rem" : "auto",
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.495 2.031 7.808L0 32l8.395-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.485-.288-5.023 1.198 1.225-4.893-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.77c-.398-.199-2.356-1.162-2.72-1.295-.365-.133-.63-.199-.896.199-.265.398-1.03 1.295-1.262 1.561-.232.265-.464.298-.862.1-.398-.199-1.682-.62-3.204-1.978-1.184-1.057-1.983-2.363-2.215-2.761-.232-.398-.025-.613.174-.811.178-.178.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.896-2.162-1.228-2.96-.323-.778-.65-.673-.896-.685l-.763-.013c-.265 0-.696.1-.1061.497-.365.398-1.394 1.362-1.394 3.324s1.427 3.856 1.626 4.121c.199.265 2.808 4.287 6.804 6.014.951.41 1.693.655 2.271.839.954.304 1.822.261 2.508.158.765-.114 2.356-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.099-.165-.365-.265-.763-.464z" />
      </svg>

      {/* Pulse animation ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{ backgroundColor: "#25D366" }}
      />
    </a>
  );
}
