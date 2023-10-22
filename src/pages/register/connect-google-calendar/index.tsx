import { MultStap } from "@/components/multStep";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LuArrowRight } from "react-icons/lu";
import { BsCheckSquare } from "react-icons/bs";
import { NextSeo } from "next-seo";

export default function ConnectGoogleCalendar() {
  const router = useRouter();
  const session = useSession();
  const hasAuthError = !!router.query.error;

  async function handleGoogleAgenda() {
    await signIn("google");
  }

  async function handleNextStep(e: any) {
    e.preventDefault();
    if (session.status !== "authenticated") return;

    router.push("/register/time-intervals");
  }

  return (
    <>
      <NextSeo
        title="Conecte sua agenta do google | Ignite Call"
        description="Precisamos de algumas informações para criar seu perfil! Ah, você
        pode editar essas informações depois."
        noindex
      />

      <div className="max-w-xl mx-auto px-2 flex flex-col justify-center h-screen">
        <header className="px-2">
          <h2 className="text-4xl text-gray-300 font-roboto font-bold mb-4">
            Conecte sua agenda!
          </h2>

          <p className="font-roboto text-sm text-gray-400 mb-6">
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </p>
        </header>

        <MultStap size={4} currentStep={2} />

        <form className="bg-gray-900 p-4 rounded-lg flex flex-col gap-5">
          <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
            <p className="text-white text-base">Google Agenda</p>

            <button
              onClick={handleGoogleAgenda}
              type="button"
              disabled={session.status === "authenticated"}
              className={`flex items-center px-4 py-2 gap-2 rounded-md justify-center ${
                session.status !== "authenticated"
                  ? "border border-green-600 text-green-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {session.status !== "authenticated" ? "Conectar" : "Conectado"}
              {session.status !== "authenticated" ? (
                <LuArrowRight />
              ) : (
                <BsCheckSquare />
              )}
            </button>
          </div>

          {hasAuthError && (
            <p className="text-red-500 text-xs font-light">
              Você deve aceitar as permissões do google calendar para seguir na
              aplicação
            </p>
          )}

          <button
            className={`flex items-center justify-center h-10 rounded-lg gap-4 text-base transition-colors ${
              session.status === "authenticated"
                ? "border border-green-600 hover:bg-green-400 text-white bg-green-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            type="submit"
            onClick={handleNextStep}
            disabled={session.status !== "authenticated"}
          >
            Próximo passo
            <LuArrowRight />
          </button>
        </form>
      </div>
    </>
  );
}
