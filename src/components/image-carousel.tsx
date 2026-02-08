import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImageCarousel = ({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) return null;

    const next = () => setCurrent((curr) => (curr + 1) % images.length);
    const prev = () => setCurrent((curr) => (curr - 1 + images.length) % images.length);

    return (
        <div className="relative h-48 w-full rounded-md overflow-hidden bg-muted group">
            <img
                src={images[current]}
                alt={`Bukti ${current + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
            />
            {images.length > 1 && (
                <>
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
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
                            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                next();
                            }}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full transition-all ${idx === current ? "bg-black w-3" : "bg-black/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
