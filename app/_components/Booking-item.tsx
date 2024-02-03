import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
  return (
    <Card>
      <CardContent className="p-5 flex justify-between py-0">
        <div className="flex flex-col gap-2 py-5">
          <Badge className="bg-[#221c3d] text-primary hover:bg-[#221c3d] w-fit">
            Confirmado
          </Badge>
          <h2 className="font-bold text-[16px]">Haircut</h2>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" alt="Avatar" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">Vintage Barber</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l border-solid border-secondary px-3">
          <p className="text-sm">February</p>
          <p className="text-2xl">03</p>
          <p className="text-sm">23:44</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingItem;