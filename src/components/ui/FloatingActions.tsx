import { BackToTop } from "./BackToTop";
import { WhatsAppButton } from "./WhatsAppButton";
import { ChatWidget } from "@/components/chat/ChatWidget";

export function FloatingActions() {
  return (
    <>
      {/* Stacked from bottom: BackToTop (bottom-6), WhatsApp (bottom-24), Chat (bottom-44) */}
      <BackToTop />
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}
