import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSidebar } from './ui/sidebar';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';

    return (
        <>
            {collapsed && !showEmail && (
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : (
                    <>
                        {!user.email_verified_by_admin_at && (
                            <span className="truncate text-xs text-muted-foreground">
                                Unverified
                            </span>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
