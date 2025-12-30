import "./globals.css";
import Header from "./components/header";

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

      </body>
    </html>
  );
}
