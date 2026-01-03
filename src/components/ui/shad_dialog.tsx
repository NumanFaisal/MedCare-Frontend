"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React from "react"

interface AppDialogProps {
    open: boolean
    onClose: (open: boolean) => void
    title: string
    children: React.ReactNode
}

export function AppDialog({
    open,
    onClose,
    title,
    children,
}: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white max-h-[85vh] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between flex-none">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto min-h-0 mt-2 pr-2">
                    <div className="space-y-3">
                        {children}
                    </div>
                </div>

                {/* Footer close button */}
                <div className="flex justify-end mt-4 flex-none">
                    <Button variant="outline" onClick={() => onClose(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
