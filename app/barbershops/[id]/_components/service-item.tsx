"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { getDayBookings } from "../_actions/get-day-bookings";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ServiceItemProps {
  barbershop: Barbershop
  service: Service,
  isAuthenticated: boolean
}

const ServiceItem = ({ service, isAuthenticated, barbershop }: ServiceItemProps) => {

  const { data } = useSession();
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  useEffect(() => {
    if(!date) return;
    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);

      setDayBookings(_dayBookings);
    }

    refreshAvailableHours();
  }, [date, barbershop.id]);
  
  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) return signIn('google')

    // TODO: abrir modal de agendamento
  }

  const handleBookingSubmit = async () => {

    setSubmitIsLoading(true)

    try {
      if (!hour || !date || !data?.user) return

      //hour: "09:45"
      const dateHour = Number(hour.split(":")[0])
      const dateMinutes = Number(hour.split(":")[1])

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id
      })

      // close the dialog window and clear the time and date fields
      setSheetIsOpen(false);
      setHour(undefined)
      setDate(undefined)

      // show toast
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Reserva para: 'dd 'de' MMMM 'às' HH':'mm'.'", {locale: ptBR}),
        action: {
          label: "Visualizar",
          onClick: () => router.push('/bookings'),
        },
      })

    } catch (error) {
      console.log(error)
    } finally {
      setSubmitIsLoading(false)
    }
  }

  const timeList = useMemo(() => {

    if(!date){
      return []
    }

    return generateDayTimeList(date).filter((time) => {
      // se houver alguma reserva em "dayBookings" com a hora e
      // minutos igual a time, não incluir na lista
      
      const timeHour = Number(time.split(":")[0])
      const timeMinutes = Number(time.split(":")[1])

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return (bookingHour === timeHour) && (bookingMinutes === timeMinutes)
      })

      if(!booking) return true

      return false

    })

  }, [date, dayBookings])


  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">

          {/* left side*/}
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className='rounded-lg'
              src={service.imageUrl}
              fill
              style={{ objectFit: "contain" }}
              alt="Image service"
            />
          </div>

          {/* right side */}
          <div className="flex flex-col w-full">
            {/* name */}
            <h2 className="font-bold">
              {service.name}
            </h2>

            {/* description */}
            <p className="text-sm text-gray-400">{service.description}</p>

            {/* price and button */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">{
                Intl.NumberFormat(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }).format(service.price)
              }
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Agendar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize"
                        },
                        cell: {
                          width: "100%",
                          color: 'green'
                        },
                        button: {
                          width: "100%"
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px"
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px"
                        },
                        caption: {
                          textTransform: "capitalize"
                        }
                      }}
                    />
                  </div>

                  {/* Mostra lista de horários apenas se alguma data tiver selecionada */}
                  {date && (
                    <div className="flex overflow-x-auto gap-3 px-5 py-6 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button onClick={() => handleHourClick(time)} variant={
                          hour === time ? 'default' : 'outline'
                        } className="rounded-full" key={time}>
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="flex flex-col gap-3 p-3">
                        <div className="flex justify-between items-center">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">{Intl.NumberFormat(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }).format(service.price)}</h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm">
                              <span>{format(date, "dd 'de '", { locale: ptBR })}</span>
                              <span className="capitalize">{format(date, "MMMM", { locale: ptBR })}</span>
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>

                      </CardContent>
                    </Card>

                  </div>
                  <SheetFooter className="px-5">
                    <Button 
                      onClick={handleBookingSubmit} 
                      disabled={(!hour || !date) || submitIsLoading}
                    >
                       {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Agendamento
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;