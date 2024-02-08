import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";

interface BarbershopDetailsProps {
  params: {
    id?: string;
  }
}
const BarbershopDetailsPage = async ({ params }: BarbershopDetailsProps) => {

  if (!params.id) {
    // TODO: redirect to home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id
    },
    include: {
      services: true
    }
  })

  if (!barbershop) {
    // TODO: redirect to home page
    return null
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="flex flex-col gap-4 px-5 py-6">
        {barbershop.services.map((service: any) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopDetailsPage;