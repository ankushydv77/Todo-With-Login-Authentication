import { useState } from 'react';
import { X, User, Lock, Save, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Profile State
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Update local state when user prop changes
    if (isOpen && user && username === '' && bio === '') {
        setUsername(user.username);
        setBio(user.bio || '');
    }

    if (!isOpen) return null;

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.put('/auth/me', { username, bio });
            setSuccess('Profile updated successfully!');
            onUpdate(); // Refresh user data in parent
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });
            setSuccess('Password changed successfully! Please login again.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                logout(); // Force logout on password change for security
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to change password');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                    <h2 className="text-xl font-semibold tracking-tight">Edit Profile</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-6">
                    <div className="flex p-1 bg-muted rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'profile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User className="h-4 w-4" /> Profile
                        </button>
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'security' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Lock className="h-4 w-4" /> Security
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Messages */}
                    {error && (
                        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2">
                            <span>•</span> {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 rounded-md bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20 flex items-center gap-2">
                            <span>•</span> {success}
                        </div>
                    )}

                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us a little about yourself"
                                />
                            </div>
                            <div className="pt-2">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Current Password</label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">New Password</label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Confirm New Password</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-background"
                                />
                            </div>
                            <div className="pt-2">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
