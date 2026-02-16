import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TaskCard from '../components/TaskCard';
import EditProfileModal from '../components/EditProfileModal';
import api from '../api/axios';
import { Search, Plus } from 'lucide-react';

const Dashboard = () => {
    const { user, checkUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const fetchTasks = async () => {
        try {
            let url = '/tasks';
            const params = [];
            if (filterStatus !== 'all') params.push(`status=${filterStatus}`);
            if (searchQuery) params.push(`search=${searchQuery}`);
            if (params.length > 0) url += `?${params.join('&')}`;

            const { data } = await api.get(url);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus, searchQuery]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await api.post('/tasks', { title: newTaskTitle, description: 'No description' });
            setNewTaskTitle('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {user && (
                <div className="container max-w-screen-2xl py-4 px-6 md:px-12 lg:px-24">
                    <h2 className="text-2xl font-bold tracking-tight">Welcome, {user.username} 👋</h2>
                </div>
            )}
            <main className="container max-w-screen-2xl py-8 px-6 md:px-12 lg:px-24">
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    {/* Main Content */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Tasks</h1>
                                <p className="text-muted-foreground mt-2">Manage your daily tasks efficiently.</p>
                            </div>
                            <div className="flex w-full sm:w-auto items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search tasks..."
                                        className="pl-8 w-full sm:w-[200px] bg-background"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <form onSubmit={handleAddTask} className="flex gap-2 p-1 bg-card border rounded-lg shadow-sm">
                            <Input
                                placeholder="Add a new task..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="flex-1 border-none shadow-none focus-visible:ring-0"
                            />
                            <Button type="submit">
                                <Plus className="mr-2 h-4 w-4" /> Add Task
                            </Button>
                        </form>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onUpdate={fetchTasks}
                                        onDelete={handleDeleteTask}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
                                    <p className="text-lg">No tasks found.</p>
                                    <p className="text-sm">Create a new task to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Profile Settings */}
                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{user?.username}</h3>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Bio</label>
                                    <p className="text-sm text-foreground/90 leading-relaxed">{user?.bio || "No bio yet."}</p>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => setIsEditProfileOpen(true)}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={user}
                onUpdate={checkUser}
            />
        </div>
    );
};

export default Dashboard;
