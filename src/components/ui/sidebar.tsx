// src/components/sidebar.tsx

"use client";

// --- This section imports all the necessary tools and components ---
// Think of these as bringing in pre-made parts, like buttons, icons, and styling tools.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Configuration Section ---
// These are settings for the sidebar that can be easily changed here.
const SIDEBAR_COOKIE_NAME = "sidebar_state"; // Name of the cookie to remember if the sidebar was open or closed
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // How long the cookie lasts (7 days)
const SIDEBAR_WIDTH = "16rem"; // The width of the sidebar on a desktop
const SIDEBAR_WIDTH_MOBILE = "18rem"; // The width of the sidebar on a phone
const SIDEBAR_WIDTH_ICON = "3rem"; // The width when it's collapsed to only show icons
const SIDEBAR_KEYBOARD_SHORTCUT = "b"; // The key to press with Ctrl/Cmd to toggle the sidebar

// --- The "Brain" of the Sidebar ---
// This part creates a central information hub (a React Context) for all sidebar components.
// All the smaller pieces of the sidebar can ask this hub for information,
// like "Is the sidebar currently open?" or "Are we on a mobile device?".

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

// This is a simple helper that any component can use to talk to the "brain".
// The error message is a safeguard: it tells developers if they use a sidebar piece incorrectly.
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// ==================================================================================
// == SidebarProvider: The Manager ==
// ==================================================================================
// This is the MOST IMPORTANT component. It's the "manager" for the entire sidebar system.
// You must wrap your page layout with this component. It doesn't show anything on its own,
// but it provides all the logic and state to the other sidebar components.
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This section manages whether the sidebar is open or closed on desktop.
  // It also saves this choice in a browser cookie.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // A simple function to open/close the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // This effect listens for the keyboard shortcut (e.g., Ctrl + B) to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  // All the managed information is bundled up to be passed to other components.
  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  // Finally, it provides this information to all its children.
  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";


// ==================================================================================
// == Sidebar Building Blocks ==
// ==================================================================================
// The components below are like LEGO bricks. You use them inside the SidebarProvider
// to build the actual sidebar that you see on the screen.

/**
 * Sidebar: The main container for the sidebar itself.
 * It automatically handles showing a slide-out menu on mobile
 * and a collapsible panel on desktop.
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // If the sidebar is set to never collapse, it returns a simple version.
  if (collapsible === "none") {
    // ... code for non-collapsible sidebar
  }

  // If on a mobile device, it uses a "Sheet" component to slide out.
  if (isMobile) {
    // ... code for mobile slide-out sidebar
  }

  // Otherwise, it returns the complex, collapsible desktop version.
  return (
    // ... code for desktop collapsible sidebar
  );
});
Sidebar.displayName = "Sidebar";

/**
 * SidebarTrigger: A simple button (usually with a menu icon)
 * that is used to open and close the sidebar.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  // ... code for the trigger button
});
SidebarTrigger.displayName = "SidebarTrigger";

/**
 * SidebarInset: The main content area of your page.
 * This component automatically adjusts its position when the sidebar opens or closes.
 */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  // ... code for the main content area
});
SidebarInset.displayName = "SidebarInset";


// --- Other specialized "LEGO Bricks" for building the sidebar ---

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(/* ... */);
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(/* ... */);
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(/* ... */);
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(/* ... */);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(/* ... */);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, /* ... */>(/* ... */);
SidebarMenuButton.displayName = "SidebarMenuButton";

// ... (and so on for all the other small components)


// ==================================================================================
// == Exports ==
// ==================================================================================
// This section makes all the sidebar "LEGO bricks" you've defined above
// available to be used in other files throughout your application.
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider, // The most important export: the "manager"
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar, // The helper to get sidebar info
};
