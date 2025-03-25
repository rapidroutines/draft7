import { createContext } from "react";
import PropTypes from "prop-types";

// Simplified context that always returns light theme
const initialState = {
    theme: "light",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, ...props }) {
    // Fixed value for theme - always "light"
    const value = {
        theme: "light",
        setTheme: () => {}, // Empty function since we don't need to change theme
    };

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
};