import {
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

export const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
  isDarkMode: true,
});

const LOCALSTORAGE_KEY = "ko-fi-xyz.theme";

function getIsDarkMode({ theme, isCSSDarkMode }) {
  if (theme === "system") {
    return isCSSDarkMode;
  }

  return theme === "dark";
}

export function ThemeProvider(props) {
  const [theme, setStateTheme] = useState("system");
  const [isCSSDarkMode, setIsCSSDarkMode] = useState(true);

  const isDarkMode = getIsDarkMode({ theme, isCSSDarkMode });

  function setTheme(theme) {
    setStateTheme(theme);

    if (window?.localStorage) {
      window.localStorage.setItem(LOCALSTORAGE_KEY, theme);
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("theme--light");
      document.body.classList.add("theme--dark");
    } else {
      document.body.classList.remove("theme--dark");
      document.body.classList.add("theme--light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const isDarkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsCSSDarkMode(!!isDarkModeMediaQuery.matches);

    const mediaQueryChangeHandler = (event) => {
      setIsCSSDarkMode(!!event.matches);
    };
    isDarkModeMediaQuery.addEventListener(
      "change",
      mediaQueryChangeHandler
    );

    return () => {
      isDarkModeMediaQuery.removeEventListener(
        "change",
        mediaQueryChangeHandler
      );
    };
  }, []);

  useEffect(() => {
    if (window.localStorage) {
      try {
        const theme = window.localStorage.getItem(LOCALSTORAGE_KEY);
        if (theme) {
          setStateTheme(theme);
        }
      } catch (e) {
        // ...
      }
    }

    const localStorageChangeHandler = async (event) => {
      if (event?.key !== LOCALSTORAGE_KEY) {
        return;
      }

      const theme = event.newValue;
      if (theme) {
        setStateTheme(theme);
      }
    };
    window.addEventListener("storage", localStorageChangeHandler);

    return () => {
      window.removeEventListener(
        "storage",
        localStorageChangeHandler
      );
    };
  }, []);

  const value = {
    isDarkMode,
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value} {...props} />;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(`useTheme must be used within a ThemeProvider.`);
  }
  return context;
};
