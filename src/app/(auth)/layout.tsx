import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

const Authlayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Toaster position="top-right" />
        </>
    );
};

export default Authlayout;