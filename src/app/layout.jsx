import "./globals.css";
import Header from "./components/header";
import Footer from "@/app/components/Footer"

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

        <Footer />

      </body>
    </html>
  );
}
