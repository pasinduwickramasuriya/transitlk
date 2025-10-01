// "use client"

// import * as React from "react"
// import * as ProgressPrimitive from "@radix-ui/react-progress"
// import { cn } from "@/lib/utils"

// interface ProgressProps
//   extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
//   value?: number
//   indicatorClassName?: string
// }

// const Progress = React.forwardRef<
//   React.ElementRef<typeof ProgressPrimitive.Root>,
//   ProgressProps
// >(({ className, value = 0, indicatorClassName, ...props }, ref) => (
//   <ProgressPrimitive.Root
//     ref={ref}
//     className={cn(
//       "relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
//       className
//     )}
//     {...props}
//   >
//     <ProgressPrimitive.Indicator
//       className={cn(
//         "h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-in-out",
//         indicatorClassName
//       )}
//       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//     />
//   </ProgressPrimitive.Root>
// ))
// Progress.displayName = ProgressPrimitive.Root.displayName

// export { Progress }
