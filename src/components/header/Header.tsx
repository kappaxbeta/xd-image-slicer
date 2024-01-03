import { siteConfig } from "@/config/site"
import {Button} from "@/components/ui/button"
import { HeaderIcons  as Icons} from "@/components/icons/HeaderIcons.tsx"
//import { MainNav } from "@/components/main-nav"
//import { ThemeToggle } from "@/components/theme-toggle"
import logo from "./logo.png"
export function Header() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b flex flex-col ">
            <div className="container w-full w-screen flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <img src={logo} className={"h-10 w-10"}  />
                <a href="/" className="flex items-center space-x-2 flex-1 justify-center">
                    <span className="inline-block font-bold">{siteConfig.name}</span>
                </a>

                <Button variant={"ghost"} className={"rounded"}>
                    <Icons.gitHub className="h-4 w-4 fill-current"/>
                    <span className="sr-only">Github</span>
                </Button>
            </div>


        </header>
    )
}
