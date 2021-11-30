import { UserProvider } from "../components/UserProvider/UserProvider.js";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider.js";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
