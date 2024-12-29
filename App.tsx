import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PixelWallpapers from "./PixelWallpapers";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <PixelWallpapers />
    </QueryClientProvider>
  );
}
