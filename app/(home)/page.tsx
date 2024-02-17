
import Header from "../_components/Header";
import { format } from 'date-fns';
import Search from "./_components/Search";
import BookingItem from "../_components/Booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/Barbershop-item";
import { ptBR } from 'date-fns/locale';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "../_components/ui/avatar";


export default async function Home() {

  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user ? db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      }
    }) : Promise.resolve([])


  ])

  return (
    <div>

      {/* Header component */}
      <Header />

      {
        /* Welcome message */
        session?.user && (
        <div className="px-5 pt-5">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image ?? ''} alt="Avatar" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{session?.user?.name}</h2>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <span className="capitalize ">{format(new Date(), "EEEE", { locale: ptBR })}</span>
            {format(new Date(), "',' dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>)
      }

      {/* Search component */}
      <div className="px-5 mt-6">
        <Search />
      </div>

      {/* Booking component */}
      <div className="mt-6">
        {confirmedBookings.length > 0 ?
          <h2 className="pl-5 mb-3 text-xs uppercase text-gray-400 font-bold">
            Agendamentos
          </h2> : <p>Não há agendamentos realizados!</p>}
        <div className="px-5 mt-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking: any) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 mb-3 text-xs uppercase text-gray-400 font-bold">Recomendados</h2>
        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden p-5">
          {barbershops.map((barbershop: any) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 mb-3 text-xs uppercase text-gray-400 font-bold">Populares</h2>
        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden p-5">
          {barbershops.map((barbershop: any) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
