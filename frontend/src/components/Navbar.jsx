import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 max-w-screen-2xl items-center px-6 md:px-12 lg:px-24">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold sm:inline-block">FrontendTask</span>
                </Link>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search here if needed globally */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-muted-foreground mr-2">
                                    Welcome, {user.username}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                                    Dashboard
                                </Button>
                                <Button variant="secondary" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
