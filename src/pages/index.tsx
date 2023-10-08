import Image from "next/image";
import { Inter } from "next/font/google";
import appImg from "src/assets/app-main.png";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Ignite - Call</title>
      </Head>
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

            <button className="bg-red-500 rounded-lg w-56 p-2 flex justify-center gap-2 hover:bg-red-400 transition-colors">
              <i>G</i>
              Entrar com o google
            </button>
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
