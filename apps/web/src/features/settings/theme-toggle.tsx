
// "use client";

// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// import { Switch } from "@/components/ui/switch";

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const isDark = mounted && theme === "dark";

//   const handleThemeChange = (checked: boolean) => {
//     setTheme(checked ? "dark" : "light");
//   };

//   return (
//     <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4">
//       <div className="flex items-center gap-3">
//         <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
//           {isDark ? (
//             <Moon className="size-4" />
//           ) : (
//             <Sun className="size-4" />
//           )}
//         </div>

//         <div>
//           <p className="text-sm font-medium">
//             Appearance
//           </p>

//           <p className="text-xs text-muted-foreground">
//             {mounted
//               ? isDark
//                 ? "Dark mode"
//                 : "Light mode"
//               : "Light mode"}
//           </p>
//         </div>
//       </div>

//       <Switch
//         checked={isDark}
//         onCheckedChange={handleThemeChange}
//         aria-label="Toggle dark mode"
//         disabled={!mounted}
//       />
//     </div>
//   );
// }

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!mounted}
      aria-label="Toggle theme"
      className="flex size-9 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground"
    >
      {mounted ? (
        isDark ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )
      ) : (
        <Sun className="size-4" />
      )}
    </button>
  );
}