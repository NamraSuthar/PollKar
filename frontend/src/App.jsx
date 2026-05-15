import { AppRoutes } from "./routes/AppRoutes";
import { useTheme } from "./common/hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return <AppRoutes theme={theme} onToggleTheme={toggleTheme} />;
}
