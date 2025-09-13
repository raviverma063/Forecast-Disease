"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

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
    )

    // Assign the Provider to a capitalized variable to fix JSX syntax error.
    const Provider = SidebarContext.Provider;

    return (
      <Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { isMobile } = useSidebar()

  if (isMobile) {
    return (
      <SidebarMobile ref={ref} {...props}>
        {children}
      </SidebarMobile>
    )
  }

  return (
    <SidebarDesktop ref={ref} {...props}>
      {children}
    </SidebarDesktop>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarDesktop = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      className={cn(
        "hidden transition-all duration-300 ease-in-out lg:block",
        state === "expanded"
          ? "w-[var(--sidebar-width)]"
          : "w-[var(--sidebar-width-icon)]",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarDesktop.displayName = "SidebarDesktop"

const SidebarMobile = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { openMobile, setOpenMobile } = useSidebar()

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent
        side="left"
        className={cn(
          "w-[var(--sidebar-width-mobile)] px-3 pt-10",
          className
        )}
        {...props}
      >
        {children}
      </SheetContent>
    </Sheet>
  )
})
SidebarMobile.displayName = "SidebarMobile"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      className={cn("flex items-center", {
        "px-2.5": state === "expanded",
        "w-fit mx-auto": state === "collapsed",
      })}
      ref={ref}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarHeaderTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      className={cn("text-lg font-semibold tracking-tight", {
        "opacity-0 w-0": state === "collapsed",
      })}
      ref={ref}
      {...props}
    />
  )
})
SidebarHeaderTitle.displayName = "SidebarHeaderTitle"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    asChild?: boolean
  }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn("h-full w-full", className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mt-auto border-t pt-2 w-full",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarTogle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn("lg:hidden", className)}
        ref={ref}
        {...props}
      >
        <PanelLeft />
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("hidden lg:flex", className)}
          ref={ref}
          {...props}
        >
          <PanelLeft />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {state === "expanded" ? "Collapse" : "Expand"} sidebar (
          <kbd className="bg-muted text-xs rounded-sm p-0.5">⌘B</kbd>)
        </p>
      </TooltipContent>
    </Tooltip>
  )
})
SidebarTogle.displayName = "SidebarTogle"

const itemVariants = cva(
  "flex items-center gap-2.5 rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "aria-[current=page]:bg-primary/15 text-primary",
        secondary:
          "hover:bg-muted aria-[current=page]:bg-muted/50 text-muted-foreground",
      },
      state: {
        expanded: "px-3 py-2",
        collapsed: "mx-auto w-fit p-2",
      },
    },
    defaultVariants: {
      variant: "secondary",
      state: "expanded",
    },
  }
)

interface ItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  isActive?: boolean
  label: string
}

const SidebarItem = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    { className, asChild, variant, state: stateProp, isActive, icon, label, ...props },
    ref
  ) => {
    const { state: stateContext } = useSidebar()
    const state = stateProp ?? stateContext
    const Comp = asChild ? Slot : "div"

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            aria-current={isActive ? "page" : undefined}
            className={cn(itemVariants({ variant, state }), className)}
            ref={ref}
            {...props}
          >
            {icon && <div className="min-w-6 w-6">{icon}</div>}
            <span
              className={cn("truncate transition-all", {
                "opacity-0 w-0": state === "collapsed",
              })}
            >
              {label}
            </span>
          </Comp>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className={cn({
            hidden: state === "expanded",
          })}
        >
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.ComponentProps<"hr">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <Separator
      className={cn(
        "my-2",
        {
          "mx-auto w-1/2": state === "collapsed",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-full", {
              hidden: state === "expanded",
            })}
          >
            <PanelLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Search</p>
        </TooltipContent>
      </Tooltip>
      <div
        className={cn("relative", {
          hidden: state === "collapsed",
        })}
      >
        <PanelLeft className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className={cn(
            "w-full rounded-lg bg-background pl-8 focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  )
})
SidebarSearch.displayName = "SidebarSearch"

const SidebarLoading = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div className={cn("flex flex-col gap-3", className)} ref={ref} {...props}>
      <div
        className={cn("flex items-center gap-2", {
          "px-2.5": state === "expanded",
          "w-fit mx-auto": state === "collapsed",
        })}
      >
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton
          className={cn("h-4 w-24", {
            "opacity-0 w-0": state === "collapsed",
          })}
        />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn("flex items-center gap-2.5", {
              "px-3 py-2": state === "expanded",
              "mx-auto w-fit p-2": state === "collapsed",
            })}
          >
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton
              className={cn("h-4 w-32", {
                "opacity-0 w-0": state === "collapsed",
              })}
            />
          </div>
        ))}
      </div>
    </div>
  )
})
SidebarLoading.displayName = "SidebarLoading"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarItem,
  SidebarLoading,
  SidebarProvider,
  SidebarSearch,
  SidebarSeparator,
  SidebarTogle,
  useSidebar,
}
