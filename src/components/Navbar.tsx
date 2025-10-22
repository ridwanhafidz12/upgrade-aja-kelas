import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Upgradeaja
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <Button variant="ghost">Kursus</Button>
          </Link>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <Button variant="outline" onClick={signOut}>
                Keluar
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default">Masuk</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
