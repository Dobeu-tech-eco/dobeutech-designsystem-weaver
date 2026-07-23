import type { ReactNode } from "react";
import { ForgeTheme } from "./theme";

export function App({ children }: { children?: ReactNode }) {
  return <ForgeTheme>{children ?? <p>Radix consumer smoke</p>}</ForgeTheme>;
}
