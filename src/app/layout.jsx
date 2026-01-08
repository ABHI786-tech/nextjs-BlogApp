import "./globals.css";
import Header from "./components/header";
import Footer from "./components/Footer" ;
import Chatbot from "./components/chatbot";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main>
          {children}
        </main>
          <Chatbot />

        <Footer />

      </body>
    </html>
  );
}
