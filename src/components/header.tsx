
'use client';

import Link from 'next/link';
import {
  Bell,
  PlusCircle,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Shield,
  LogIn,
} from 'lucide-react';
import type { User } from '@/types';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommuniQLogo } from './icons';
import { Separator } from './ui/separator';

const notifications = [
  { id: 1, text: 'John Doe answered your question about React Hooks.' },
  { id: 2, text: 'You were mentioned in a comment by Jane Smith.' },
  { id: 3, text: 'Your answer was accepted for "How to center a div?".' },
];

interface HeaderProps {
    currentUser: User | null;
}

export function Header({ currentUser }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <CommuniQLogo className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold">CommuniQ</span>
        </Link>

        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search questions..." className="pl-10" />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/ask" passHref>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Ask a Question
            </Button>
          </Link>

        {currentUser ? (
          <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {notifications.length} unread messages.
                  </p>
                </div>
                <div className="grid gap-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-2 -mx-2 rounded-lg hover:bg-secondary"
                    >
                      <Bell className="mt-1 h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        {notification.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-8" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatarUrl} data-ai-hint="user avatar" alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                 {currentUser.role === 'admin' && (
                  <DropdownMenuItem asChild>
                     <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
        ) : (
            <Link href="/login" passHref>
                <Button variant="outline">
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                </Button>
            </Link>
        )}
        </div>
      </div>
    </header>
  );
}
