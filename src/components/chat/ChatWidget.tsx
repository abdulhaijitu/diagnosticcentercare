import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const quickReplies = [
  "টেস্টের দাম জানতে চাই",
  "হোম কালেকশন সম্পর্কে জানতে চাই",
  "অ্যাপয়েন্টমেন্ট বুক করতে চাই",
  "রিপোর্ট কবে পাব?",
];

const botResponses: Record<string, string> = {
  "টেস্টের দাম জানতে চাই": "আমাদের সব টেস্টের দাম দেখতে 'Tests' পেজে যান অথবা 01345580203 নম্বরে কল করুন। আমরা সবসময় সাশ্রয়ী মূল্যে সেবা দিই।",
  "হোম কালেকশন সম্পর্কে জানতে চাই": "আমরা ঢাকা শহরের সব এলাকায় হোম কালেকশন সেবা দিই। 'Book Test' পেজ থেকে বুক করুন। আমাদের ট্রেইনড ফ্লেবোটমিস্ট আপনার বাসায় এসে স্যাম্পল সংগ্রহ করবেন।",
  "অ্যাপয়েন্টমেন্ট বুক করতে চাই": "অ্যাপয়েন্টমেন্ট বুক করতে 'Doctors' পেজে গিয়ে আপনার পছন্দের ডাক্তার সিলেক্ট করুন এবং সময় বেছে নিন।",
  "রিপোর্ট কবে পাব?": "বেশিরভাগ টেস্টের রিপোর্ট ২৪-৪৮ ঘণ্টার মধ্যে পাওয়া যায়। কিছু স্পেশাল টেস্টে ৩-৫ দিন সময় লাগতে পারে। রিপোর্ট রেডি হলে SMS ও WhatsApp-এ নোটিফিকেশন পাবেন।",
};

const defaultResponse = "ধন্যবাদ আপনার মেসেজের জন্য! আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। জরুরি প্রয়োজনে 01345580203 নম্বরে কল করুন।";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "স্বাগতম! TrustCare Diagnostic Center-এ। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const response = botResponses[text] || defaultResponse;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-44 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-accent hover:bg-accent/90 text-accent-foreground",
          "transition-all duration-300 hover:scale-110"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-64 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)]",
          "bg-card border border-border rounded-2xl shadow-2xl",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">TrustCare Support</h3>
              <p className="text-xs text-primary-foreground/80">সাধারণত কয়েক মিনিটে উত্তর দিই</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
