import Navigation from 'components/Navigation/Navigation';
import { ThemeProvider } from 'contexts/Theme';
import 'styles/globals.css';
import 'utils/Math.extensions';
import 'utils/String.extensions';

interface Props {
  children: React.ReactNode;
}

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <ThemeProvider>
        <body>
          <Navigation />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}

export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};
