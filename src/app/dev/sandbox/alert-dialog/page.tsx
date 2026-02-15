"use client"

import React from "react"
import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogHeaderImage,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react"

export default function AlertDialogSandbox() {
    return (
        <div className="container mx-auto py-10 space-y-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">AlertDialog Sandbox</h1>
                <p className="text-muted-foreground">
                    Use this page to design and preview different variations of the AlertDialog with assets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Success Variation */}
                <section className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" /> Success
                    </h2>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full">Open Success Dialog</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px]">
                            <AlertDialogHeaderImage>
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <img src="/avatars/man-email.jpg" alt="Success" className="w-24 h-24 object-cover rounded-full" />
                                </div>
                            </AlertDialogHeaderImage>
                            <div className="text-center space-y-4">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Action Successful</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Your changes have been saved successfully. You can now proceed to the next step.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogAction className="bg-green-600 hover:bg-green-700">Great!</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </section>

                {/* Warning Variation */}
                <section className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" /> Warning
                    </h2>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full">Open Warning Dialog</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px]">
                            <AlertDialogHeaderImage>
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <img src="/avatars/conversation.jpg" alt="Warning" className="w-24 h-24 object-cover rounded-full" />
                                </div>
                            </AlertDialogHeaderImage>
                            <div className="text-center space-y-4">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action might have unintended side effects. Please confirm before proceeding.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700">Proceed</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </section>

                {/* Error/Destructive Variation */}
                <section className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlertCircle className="text-destructive" /> Error
                    </h2>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full">Open Error Dialog</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px]">
                            <AlertDialogHeaderImage>
                                <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                                    <img src="/avatars/woman-holding-box.jpg" alt="Error" className="w-24 h-24 object-cover rounded-full" />
                                </div>
                            </AlertDialogHeaderImage>
                            <div className="text-center space-y-4">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive">Delete Everything</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </section>

                {/* Info Variation */}
                <section className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Info className="text-blue-500" /> Information
                    </h2>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full">Open Info Dialog</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px]">
                            <AlertDialogHeaderImage>
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <img src="/avatars/woman-ponder.jpg" alt="Info" className="w-24 h-24 object-cover rounded-full" />
                                </div>
                            </AlertDialogHeaderImage>
                            <div className="text-center space-y-4">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>New Update Available</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        We've added several new features to the platform. Check out the latest release notes.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogAction>Got it</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </section>
            </div>

            {/* Asset Placeholder Section */}
            <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-muted/30">
                <h3 className="text-xl font-bold text-muted-foreground">Ready for your Assets!</h3>
                <p className="max-w-md text-muted-foreground">
                    I've used Lucide icons as placeholders. You can now replace the `div` containing the icons with your specific asset images or SVGs.
                </p>
                <div className="bg-background p-4 rounded-lg border text-left font-mono text-sm max-w-full overflow-auto">
                    {`<div className="p-3 rounded-full">
  <img src="/your-asset-path.png" alt="Description" className="w-24 h-24" />
</div>`}
                </div>
            </div>
        </div >
    )
}
