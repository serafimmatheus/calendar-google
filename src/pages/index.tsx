import Image from "next/image";
import appImg from "src/assets/app-main.png";
import ClaimUsernameForm from "@/components/claimUsernameForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(`/schedule/${session.data?.user.username}`);
    }
  }, []);

  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem
              agendamentos no seu tempo livre."
      />

      <main>
        <div className="w-full my-max-width ml-auto h-screen gap-10 flex flex-col items-center justify-center lg:flex-row lg:flex lg:justify-between lg:items-center">
          <div className="flex flex-col gap-8 max-xl:ml-3 max-lg:w-full max-lg:px-8">
            <h1 className="text-6xl font-roboto font-extrabold max-sm:text-3xl">
              Agendamento descomplicado
            </h1>
            <p className="font-roboto text-xl font-light max-sm:text-base ">
              Conecte seu calendário e permita que as pessoas marquem
              agendamentos no seu tempo livre.
            </p>

            <ClaimUsernameForm />
          </div>

          <div className="w-full flex justify-end max-lg:pl-8">
            <Image
              src={appImg}
              alt="app calendario"
              height={400}
              quality={100}
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
