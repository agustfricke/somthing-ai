import {
  Home as H,
  Menu,
  LogOutIcon,
  Pickaxe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();


  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };

  return (
    <header className="md:hidden flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium mt-11">
            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
              Discover
            </Link>
            <Link
              to="/generate-image"
              className={getLinkClass("/generate-image")}
            >
              <Pickaxe className="h-4 w-4" />
              Generate image
            </Link>

              <button
                onClick={() => {
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
