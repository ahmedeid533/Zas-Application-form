import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./assets/layout/Layout.jsx";
import { Toaster } from "react-hot-toast";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
      <ReactQueryDevtools initialIsOpen={true} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
