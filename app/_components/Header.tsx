"use client";

import Image from 'next/image'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon, CalendarDaysIcon, CircleUserRoundIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';

const Header = () => {

  const { data, status } = useSession();

  const handleLoginClick = () => signIn("google");
  const handleLogoutClick = () => signOut();

  return (
    <Card>
      <CardContent className='p-5 justify-between items-center flex'>
        <Image src="/logo.png" alt="FSW Barber" height={22} width={120} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent className='p-0'>
            <SheetHeader className='p-5 *:text-left border-b border-solid border-secondary'>
              <SheetTitle>
                Menu
              </SheetTitle>
            </SheetHeader>
            {data?.user ? (
              <div className="flex justify-between items-center px-5 py-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={data.user?.image ?? ''} />
                  </Avatar>
                  <h2 className='font-bold'>{data.user.name}</h2>
                </div>
                <Button variant="secondary" size="icon" onClick={handleLogoutClick}>
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <div className='flex flex-col px-5 py-6 gap-5'>
                <div className="flex items-center gap-3">
                  <CircleUserRoundIcon className="text-gray-500" size={40} />
                  <h2 className='font-bold'>Olá, faça seu login!</h2>
                </div>
                <Button variant="secondary" className='w-full justify-start' onClick={handleLoginClick}>
                  <LogInIcon className='mr-2' size={18} />
                  Fazer Login
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 px-5">
              <Button variant="outline" className='justify-start' asChild>
                <Link href="/">
                  <HomeIcon size={18} className='mr-2' />
                  Início
                </Link>
              </Button>
              {data?.user && (

                <Button variant="outline" className='justify-start' asChild>
                  <Link href='/bookings'>
                    <CalendarDaysIcon size={18} className='mr-2' />
                    Agendamentos
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>

        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header