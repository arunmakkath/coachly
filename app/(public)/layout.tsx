import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chatbot/chat-widget';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <Footer />

      {/* AI Chat Widget - Available to all visitors */}
      <ChatWidget />
    </>
  );
}
