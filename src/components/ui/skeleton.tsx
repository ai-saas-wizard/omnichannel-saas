"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-zinc-100/50 dark:bg-zinc-800/50",
                className
            )}
            {...props}
        >
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent dark:via-zinc-700/50"
                animate={{
                    translateX: ["-100%", "100%"]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
            />
        </div>
    )
}

export { Skeleton }
