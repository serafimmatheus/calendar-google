import { MultStap } from "@/components/multStep";
import { api } from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { BsCheckSquare } from "react-icons/bs";
import { parseCookies } from "nookies";

interface IPropsRegisterFormSchema {
  username: string;
  name: string;
}

export default function TimeIntervals() {
  const cookies = parseCookies();
  const router = useRouter();
  const session = useSession();
  const hasAuthError = !!router.query.error;

  async function handleGoogleAgenda() {
    await signIn("google");
  }

  return (
    <div className="max-w-xl mx-auto px-2 flex flex-col justify-center h-screen">
      <header className="px-2">
        <h2 className="text-4xl text-gray-300 font-roboto font-bold mb-4">
          Quase lá
        </h2>

        <p className="font-roboto text-sm text-gray-400 mb-6">
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </p>
      </header>

      <MultStap size={4} currentStep={3} />

      <form className="bg-gray-900 p-4 rounded-lg flex flex-col gap-5">
        <div className="segunda">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Segunda feira</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="terca">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Terça feira</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="quarta">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Quarta feira</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="quinta">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Quinta feira</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="sexta">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Sexta feira</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="sabado">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Sabado</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <div className="domingo">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <label className="flex gap-2">
              <input
                className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                type="checkbox"
                name=""
                id=""
              />
              <p>Domingo</p>
            </label>

            <div className="flex gap-4">
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
              <input type="time" className="bg-gray-950 w-32 h-10 px-4" />
            </div>
          </div>
        </div>

        <button
          className={`flex items-center justify-center h-10 rounded-lg gap-4 text-base transition-colors ${
            session.status === "authenticated"
              ? "border border-green-600 hover:bg-green-400 text-white bg-green-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          type="submit"
          disabled={session.status !== "authenticated"}
        >
          "Próximo passo
          <LuArrowRight />
        </button>
      </form>
    </div>
  );
}
