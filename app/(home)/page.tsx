import { ptBR } from "date-fns/locale";
import Header from "../_components/Header";
import { format } from 'date-fns';
import Search from "./_components/Search";
import BookingItem from "../_components/Booking-item";

export default function Home() {
  return (
    <div>

      {/* Header component */}
      <Header />

      {/* Welcome message */}
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Hi, Gabriela!</h2>
        <p className="text-sm text-gray-500">
          <span className="capitalize">{format(new Date(), "EEEE")}</span>
          {format(new Date(), "',' dd 'de' MMMM")}
        </p>
      </div>

      {/* Search component */}
      <div className="px-5 mt-6">
        <Search />
      </div>

      {/* Booking component */}
      <div className="px-5 mt-6">
        <h2 className="mb-3 text-xs uppercase text-gray-400 font-bold">Schedules</h2>
        <BookingItem />
      </div>
    </div>
  );
}
