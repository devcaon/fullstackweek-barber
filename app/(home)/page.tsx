import Header from "../_components/Header";
import { format } from 'date-fns';
import Search from "./_components/Search";
import BookingItem from "../_components/Booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/Barbershop-item";
import { ptBR } from 'date-fns/locale';

export default async function Home() {

  // call prisma and load barbershops
  const barbershops = await db.barbershop.findMany({})

  return (
    <div>

      {/* Header component */}
      <Header />

      {/* Welcome message */}
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, John Doe!</h2>
        <p className="text-sm text-gray-500">
          <span className="capitalize">{format(new Date(), "EEEE", { locale: ptBR })}</span>
          {format(new Date(), "',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Search component */}
      <div className="px-5 mt-6">
        <Search />
      </div>

      {/* Booking component */}
      <div className="px-5 mt-6">
        <h2 className="mb-3 text-xs uppercase text-gray-400 font-bold">Agendamentos</h2>
        <BookingItem />
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
