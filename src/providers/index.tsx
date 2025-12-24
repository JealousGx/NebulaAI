import { composeProviders } from "./compose";
import { ThemeProvider } from "./theme";

export const AppProviders = composeProviders(ThemeProvider);
