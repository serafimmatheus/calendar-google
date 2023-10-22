import { MultStap } from "@/components/multStep";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LuArrowRight } from "react-icons/lu";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { api } from "@/lib/axios";
import { NextSeo } from "next-seo";

const schema = z.object({
  bio: z.string().optional(),
});

type IPropsSchema = z.infer<typeof schema>;

export default function UpdateProfile() {
  const router = useRouter();
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IPropsSchema>({
    resolver: zodResolver(schema),
  });

  async function handleSetUpdateFile(data: IPropsSchema) {
    await api
      .put("/users/update-profile", data)
      .then(() => {
        router.push(`/schedule/${session.data?.user.username}`);
      })
      .catch((err) => {
        alert("Erro ao atualizar perfil");
      });
  }

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, []);

  return (
    <>
      <NextSeo
        title="Atualize seu perfil | Ignite Call"
        description="Por último, uma breve descrição e uma foto de perfil."
        noindex
      />

      <div className="max-w-xl mx-auto px-2 flex flex-col justify-center h-screen">
        <header className="px-2">
          <h2 className="text-4xl text-gray-300 font-roboto font-bold mb-4">
            Defina sua disponibilidade
          </h2>

          <p className="font-roboto text-sm text-gray-400 mb-6">
            Por último, uma breve descrição e uma foto de perfil.
          </p>
        </header>

        <MultStap size={4} currentStep={4} />

        <form
          onSubmit={handleSubmit(handleSetUpdateFile)}
          className="bg-gray-900 px-10 py-5 rounded-lg flex flex-col gap-5"
        >
          <div className="w-full">
            <h4 className="mb-5">Foto do perfil</h4>

            <div className="flex items-center justify-start w-full gap-4">
              <div className="relative w-16 h-16 rounded-full border-2 border-green-400">
                <Image
                  className="rounded-full w-full h-full"
                  objectFit="cover"
                  src={session.data?.user.avatarUrl ?? ""}
                  width={100}
                  height={100}
                  alt="foto de perfil"
                />
              </div>

              <label
                id="file_input"
                className="py-2 px-4 text-sm text-green-600 border border-green-600 rounded-lg cursor-pointer bg-transparent"
              >
                Selecionar foto
                <input className="hidden" id="file_input" type="file" />
              </label>
            </div>

            <div className="mt-8">
              <p className="mb-2 ">Sobre você</p>

              <textarea
                placeholder="Fale um pouco sobre você. Isto será exibido em sua página pessoal."
                className="w-full h-40 resize-none bg-gray-950 rounded-md p-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none"
                {...register("bio")}
              ></textarea>
            </div>
          </div>

          <button
            className={`flex items-center justify-center h-10 rounded-lg gap-4 text-base transition-colors ${
              session.status === "authenticated"
                ? "border border-green-600 hover:bg-green-400 text-white bg-green-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            Finalizar
            <LuArrowRight />
          </button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  return {
    props: {
      session,
    },
  };
};
