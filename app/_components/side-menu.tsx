"use client";

import { CalendarDaysIcon, CircleUserRoundIcon, HomeIcon, LogInIcon, LogOutIcon, ScissorsIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const SideMenu = () => {

  const { data } = useSession();

  const handleLoginClick = () => signIn("google");
  const handleLogoutClick = () => signOut();

  return (
    <>
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
            <CircleUserRoundIcon size={40} />
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
        {data?.user && (
          <Button variant="outline" className='justify-start' asChild>
            <Link href='/bookings'>
              <ScissorsIcon size={18} className='mr-2' />
              Add Barbershop
            </Link>
          </Button>          
        )}
      </div>
    </>
  );
}

export default SideMenu;