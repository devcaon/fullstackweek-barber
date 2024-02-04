import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="px-1 py-0">
        <div className="w-full h-[159px] relative">
          <div className="absolute top-1 left-1 z-50">
            <Badge variant="secondary" className="flex opacity-85 items-center gap-1">
              <StarIcon size={12} className="fill-primary text-primary"/>
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="w-full rounded-2xl"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 truncate">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 truncate">
            {barbershop.address}
          </p>
          <Button className="w-full mt-3" variant="secondary">Reservar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BarbershopItem;