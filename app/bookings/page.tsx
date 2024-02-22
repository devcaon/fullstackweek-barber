import { getServerSession } from "next-auth";
import Header from "../_components/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/Booking-item";

const BookingsPage = async () => {

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect('/');
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
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
    }),

    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      }
    })

  ])

  return (
    <>
      <Header />

      <div className="px-5 py-6">

        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 text-sm font-bold uppercase mt-6 mb-3">Confirmados</h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking: any) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {finishedBookings.length > 0 && (
          <>
            < h2 className="text-gray-400 text-sm font-bold uppercase mt-6 mb-3">Finalizados</h2>

            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking: any) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div >
    </>
  );
}

export default BookingsPage;