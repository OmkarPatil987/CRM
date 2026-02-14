import { Message } from '../context/ChatContext';

export interface DateGroup {
    dateLabel: string;
    messages: Message[];
    dateObj: Date;
}

export const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

export const groupMessagesByDate = (messages: Message[]): DateGroup[] => {
    const groups: { [key: string]: DateGroup } = {};

    messages.forEach(msg => {
        const date = new Date(msg.created_at);
        const dateKey = date.toDateString();

        if (!groups[dateKey]) {
            groups[dateKey] = {
                dateLabel: formatDateLabel(msg.created_at),
                messages: [],
                dateObj: date
            };
        }
        groups[dateKey].messages.push(msg);
    });

    // Sort groups by date (oldest first)
    return Object.values(groups).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
};
