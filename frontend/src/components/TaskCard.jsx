import { useState } from 'react';
import { Pencil, Trash2, CheckCircle, Clock } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { cn } from '../lib/utils';
import api from '../api/axios';

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDesc, setEditedDesc] = useState(task.description);

    const handleSave = async () => {
        try {
            await api.put(`/tasks/${task.id}`, {
                title: editedTitle,
                description: editedDesc,
                status: task.status,
            });
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    const toggleStatus = async () => {
        try {
            await api.put(`/tasks/${task.id}`, {
                status: task.status === 'pending' ? 'completed' : 'pending',
            });
            onUpdate();
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    return (
        <div className={cn(
            "rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative group",
            task.status === 'completed' && "opacity-75 bg-muted/40"
        )}>
            {isEditing ? (
                <div className="space-y-3">
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Task title"
                        className="font-semibold"
                    />
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        value={editedDesc || ''}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        placeholder="Description..."
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className={cn("font-semibold text-lg leading-tight tracking-tight pr-6", task.status === 'completed' && "line-through text-muted-foreground")}>
                            {task.title}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-md shadow-sm border p-0.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => setIsEditing(true)}>
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(task.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {task.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${task.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'}`}>
                            {task.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground"
                            onClick={toggleStatus}
                        >
                            {task.status === 'pending' ? 'Mark Done' : 'Mark Pending'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskCard;
