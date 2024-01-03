
import {cn} from "@/lib/utils"
import { Header} from "@/components/header/Header"
interface RootLayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: RootLayoutProps) {
    return (

            <div
                className={cn(
                    "bg-background min-h-screen min-w-full font-sans antialiased"
                )}
            >

                <div className="relative flex min-h-screen min-w-1 flex-col">
                    <Header />
                    <div className="flex-1">
                        <div className={"flex-1 p-2"}>
                        {children}
                        </div>
                    </div>
                </div>

            </div>

    )
}

/**
 <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 <TailwindIndicator />
 </ThemeProvider>
 */
