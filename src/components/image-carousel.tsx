import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

export const ImageCarousel = ({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState(0);
    const [open, setOpen] = useState(false);

    if (!images || images.length === 0) return null;

    const next = () => setCurrent((curr) => (curr + 1) % images.length);
    const prev = () => setCurrent((curr) => (curr - 1 + images.length) % images.length);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="relative h-48 w-full rounded-md overflow-hidden bg-muted group">
                <DialogTrigger asChild>
                    <div className="w-full h-full cursor-zoom-in">
                        <img
                            src={images[current]}
                            alt={`Bukti ${current + 1}`}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    </div>
                </DialogTrigger>

                {images.length > 1 && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 border-none pointer-events-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 border-none pointer-events-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 w-1.5 rounded-full transition-all ${idx === current ? "bg-white w-3" : "bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <DialogContent className="max-w-screen-xl w-full h-full max-h-screen bg-black/90 border-none shadow-none p-0 flex items-center justify-center interact-none" showCloseButton={false}>
                <DialogTitle className="sr-only">Detail Gambar</DialogTitle>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                    <DialogClose className="absolute top-4 right-4 z-50">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                            <X className="w-6 h-6" />
                        </Button>
                    </DialogClose>

                    <img
                        src={images[current]}
                        alt={`Bukti ${current + 1} Full`}
                        className="max-w-full max-h-full object-contain"
                    />

                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 border-none hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 border-none hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>

                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 w-2 rounded-full transition-all cursor-pointer ${idx === current ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                                        onClick={() => setCurrent(idx)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
