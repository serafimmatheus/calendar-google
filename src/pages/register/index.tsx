import { MultStap } from "@/components/multStep";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";
import { z } from "zod";
import { parseCookies } from "nookies";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

interface IPropsRegisterFormSchema {
  username: string;
  name: string;
}

export default function Register() {
  const registerFormSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Mínimo de 3 caracteres" })
      .max(20, { message: "Máximo de 20 caracteres" })
      .regex(/^[a-z\\-]+$/i, { message: "Apenas letras e hífens" })
      .transform((username) => username.toLowerCase()),
    name: z
      .string()
      .regex(/^[a-z ]+$/i, { message: "Apenas letras" })
      .transform((username) => username.toLowerCase()),
  });

  const [formStateStaps, setFormStateStaps] = useState(1);
  const [errorRegister, setErrorRegister] = useState(false);

  const cookies = parseCookies();
  const router = useRouter();
  const session = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IPropsRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  function handleNextStep(e: any) {
    e.preventDefault();
  }

  async function handlePreRegister(data: IPropsRegisterFormSchema) {
    if (formStateStaps === 4) return console.log("finalizado");

    // setFormStateStaps(formStateStaps + 1);
    if (formStateStaps === 1) {
      await api
        .post("/users", {
          username: data.username,
          name: data.name,
        })
        .then((response) => {
          router.push(`/register/connect-google-calendar`);
        })
        .catch((err) => {
          setErrorRegister(true);
        });
    }
  }

  useEffect(() => {
    if (router.query.username) {
      setValue("username", `${router.query.username}`);
    }

    if (session.status === "authenticated") {
      router.push(`/schedule/${session.data?.user.username}`);
    }
  }, [router.query?.username, setValue, session.status]);

  return (
    <>
      <NextSeo
        title="Crie uma conta | Ignite Call"
        description="Precisamos de algumas informações para criar seu perfil! Ah, você
        pode editar essas informações depois."
      />

      <div className="max-w-xl mx-auto px-2 flex flex-col justify-center h-screen">
        <header className="px-2">
          <h2 className="text-4xl text-gray-300 font-roboto font-bold mb-4">
            Bem-vindo ao Ignite Call
          </h2>

          <p className="font-roboto text-sm text-gray-400 mb-6">
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </p>
        </header>

        <MultStap size={4} currentStep={1} />

        <form
          onSubmit={handleSubmit(handlePreRegister)}
          className="bg-gray-900 p-4 rounded-lg flex flex-col gap-5"
        >
          <label className="flex flex-col">
            <p className="text-gray-400 text-base mb-2">Nome de usuário</p>
            <input
              className={`placeholder:text-gray-600 h-10 ${
                errors.name?.message
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-transparent focus:border-green-500"
              } rounded-lg outline-none bg-gray-950 px-4 mb-2`}
              type="text"
              prefix="cal.com/"
              placeholder="Seu nome de usuário"
              {...register("username")}
            />
            <p className="text-red-400 text-xs ml-1 h-2">
              {errors.username?.message}
              {errorRegister && (
                <p className="text-red-500">Nome de usuário já cadastrado</p>
              )}
            </p>
          </label>

          <label className="flex flex-col">
            <p className="text-gray-400 text-base mb-2">Nome completo</p>
            <input
              className={`placeholder:text-gray-600 h-10 ${
                errors.name?.message
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-transparent focus:border-green-500"
              } rounded-lg outline-none bg-gray-950 px-4 mb-2`}
              type="text"
              prefix="cal.com/"
              placeholder="Seu nome completo"
              {...register("name")}
            />
            <p className="text-red-400 text-xs ml-1 h-2">
              {errors.name?.message}
            </p>
          </label>

          <button
            className={`flex bg-green-600 items-center justify-center h-10 rounded-lg gap-4 text-base hover:bg-green-400 transition-colors `}
            disabled={isSubmitting}
            type="submit"
          >
            {formStateStaps === 4 ? "Finalizar" : "Próximo passo "}
            <LuArrowRight />
          </button>
        </form>
      </div>
    </>
  );
}
