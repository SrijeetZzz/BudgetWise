// "use client";
// import { env } from "@/lib/env";
// import { useRouter } from "next/navigation";

// import { LogOut, Settings, User } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { useLogout } from "@/features/auth/hooks/use-logout";

// interface ProfileDropdownUser {
//   name?: string | null;
//   email?: string | null;
//   avatar?: string | null;
//   profileImage?: string | null;
// }

// interface ProfileDropdownProps {
//   user?: ProfileDropdownUser | null;
// }

// function getInitials(name?: string | null) {
//   if (!name?.trim()) {
//     return "U";
//   }

//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part.charAt(0).toUpperCase())
//     .join("");
// }

// export function ProfileDropdown({ user }: ProfileDropdownProps) {
//   const router = useRouter();
//   const logout = useLogout();

//   const name = user?.name?.trim() || "User";

//   const email = user?.email || "";

//   const avatarPath = user?.avatar || user?.profileImage || null;

//   const avatar = avatarPath
//     ? avatarPath.startsWith("http")
//       ? avatarPath
//       : `${env.API_URL.replace("/api/v1", "")}/${avatarPath.replace(/^\/+/, "")}`
//     : undefined;

//   return (
//     <DropdownMenu>
//       {/* Trigger */}
//       <DropdownMenuTrigger
//         className="
//           flex size-9 items-center justify-center
//           rounded-full
//           border border-border
//           bg-background
//           outline-none
//           transition-colors
//           hover:bg-muted
//           focus-visible:ring-2
//           focus-visible:ring-ring
//         "
//       >
//         <Avatar className="size-8">
//           <AvatarImage src={avatar} alt={name} />

//           <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
//         </Avatar>

//         <span className="sr-only">Open profile menu</span>
//       </DropdownMenuTrigger>

//       {/* Menu */}
//       <DropdownMenuContent
//         align="end"
//         sideOffset={8}
//         className="w-64 rounded-xl"
//       >
//         {/* User information */}
//         <DropdownMenuGroup>
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex items-center gap-3">
//               <Avatar className="size-9">
//                 <AvatarImage src={avatar} alt={name} />

//                 <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
//               </Avatar>

//               <div className="min-w-0">
//                 <p className="truncate text-sm font-semibold">{name}</p>

//                 {email && (
//                   <p className="truncate text-xs text-muted-foreground">
//                     {email}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </DropdownMenuLabel>
//         </DropdownMenuGroup>

//         <DropdownMenuSeparator />

//         {/* Profile + Settings */}
//         <DropdownMenuGroup>
//           <DropdownMenuItem onClick={() => router.push("/profile")}>
//             <User className="size-4" />
//             <span>Profile</span>
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => router.push("/settings")}>
//             <Settings className="size-4" />
//             <span>Settings</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>

//         <DropdownMenuSeparator />

//         {/* Logout */}
//         <DropdownMenuGroup>
//           <DropdownMenuItem
//             disabled={logout.isPending}
//             onClick={() => logout.mutate()}
//             className="text-destructive focus:text-destructive"
//           >
//             <LogOut className="size-4" />

//             <span>{logout.isPending ? "Logging out..." : "Logout"}</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import { env } from "@/lib/env";
import { useRouter } from "next/navigation";

import { LogOut, Settings, User, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLogout } from "@/features/auth/hooks/use-logout";

interface ProfileDropdownUser {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  profileImage?: string | null;
}

interface ProfileDropdownProps {
  user?: ProfileDropdownUser | null;
}

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const logout = useLogout();

  const name = user?.name?.trim() || "User";
  const email = user?.email || "";

  const avatarPath = user?.avatar || user?.profileImage || null;

  const avatar = avatarPath
    ? avatarPath.startsWith("http")
      ? avatarPath
      : `${env.API_URL.replace("/api/v1", "")}/${avatarPath.replace(/^\/+/, "")}`
    : undefined;

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger className="group flex size-9 items-center justify-center rounded-full border border-border/60 bg-background outline-none transition-all hover:border-border hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/20">
        <Avatar className="size-8 transition-transform duration-200 group-hover:scale-105">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>

        <span className="sr-only">Open profile menu</span>
      </DropdownMenuTrigger>

      {/* Menu Content */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border-border/60 p-1.5 shadow-lg"
      >
        {/* User Information Header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2.5 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border/40">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {name}
                  </p>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                    <Sparkles className="size-2.5" />
                    <span>Free</span>
                  </span>
                </div>

                {email && (
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-border/50" />

        {/* Profile + Settings Nav Options */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:bg-muted"
          >
            <User className="size-4 text-muted-foreground" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:bg-muted"
          >
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-border/50" />

        {/* Logout Option */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="size-4" />
            <span>{logout.isPending ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}