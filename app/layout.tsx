import Navigation from 'components/Navigation/Navigation';
import { ThemeProvider } from 'contexts/Theme';
import 'styles/globals.css';
interface Props {
  children: React.ReactNode;
}

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <ThemeProvider>
        <body
          style={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Navigation />
          <div
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'scroll',
            }}
          >
            {children}
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}

export const metadata = {
  title: 'Schedule',
  description: 'Welcome to Next.js',
};
