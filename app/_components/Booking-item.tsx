"use client";
import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true
      barbershop: true
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {

  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const isBookingFinished = isPast(booking.date)

  const handleCancelClick = async () => {

    setIsDeleteLoading(true)
    try {
      await cancelBooking(booking.id)
      toast.success("Agendamento cancelado com sucesso!")
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full cursor-pointer">
          <CardContent className="px-0 flex py-0">
            <div className="flex flex-col gap-2 py-5 flex-[3] pl-5">
              <Badge variant={
                isBookingFinished ? 'secondary' : 'default'
              } className="w-fit"
              >
                {isBookingFinished ? 'Finalizado' : 'Confirmado'}
              </Badge>
              <h2 className="font-bold text-[16px]">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={booking.barbershop.imageUrl} alt="Avatar" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
              <p className="text-sm capitalize">{format(booking.date, "MMMM", { locale: ptBR })}</p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, 'hh:mm')}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="px-0">
        <SheetHeader>
          <SheetTitle className="text-left px-5 pb-6 border-b border-solid border-secondary">
            Informações do Agendamento
          </SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image className="rounded-lg" src="/barbershop-map.png" fill alt={booking.barbershop.name} />

            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card className="">
                <CardContent className="flex gap-2 p-3">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>
                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs text-nowrap truncate ">{booking.barbershop.address}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge variant={
            isBookingFinished ? 'secondary' : 'default'
          } className="w-fit my-3"
          >
            {isBookingFinished ? 'Finalizado' : 'Confirmado'}
          </Badge>

          <Card>
            <CardContent className="flex flex-col gap-3 p-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">{Intl.NumberFormat(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }).format(booking.service.price)}</h3>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400 text-sm">Data</h3>
                <h4 className="text-sm">
                  <span>{format(booking.date, "dd 'de '", { locale: ptBR })}</span>
                  <span className="capitalize">{format(booking.date, "MMMM", { locale: ptBR })}</span>
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400 text-sm">Horário</h3>
                <h4 className="text-sm">{format(booking.date, 'hh:mm')}</h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400 text-sm">Barbearia</h3>
                <h4 className="text-sm">{booking.barbershop.name}</h4>
              </div>

            </CardContent>
          </Card>

          <SheetFooter className="flex-row w-full gap-3 mt-6">
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">Voltar</Button>
            </SheetClose>


            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isBookingFinished || isDeleteLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cancelar Agendamento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Deseja mesmo cancelar agendamento?</AlertDialogTitle>
                  <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso excluirá permanentemente seu agendamento.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center gap-3">
                  <AlertDialogCancel className="w-full mt-0">Voltar</AlertDialogCancel>
                  <AlertDialogAction disabled={isDeleteLoading}className="w-full" onClick={handleCancelClick}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </SheetFooter>

        </div>

      </SheetContent>
    </Sheet>
  );
}

export default BookingItem;