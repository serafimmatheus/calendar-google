import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";
import { z } from "zod";

type IPropsClainUsernameFormData = {
  username: string;
};

export default function ClaimUsernameForm() {
  const schemaUsername = z.object({
    username: z
      .string()
      .min(3, { message: "Mínimo de 3 caracteres" })
      .max(20, { message: "Máximo de 20 caracteres" })
      .regex(/^[a-z\\-]+$/i, { message: "Apenas letras e hífens" })
      .transform((username) => username.toLowerCase()),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IPropsClainUsernameFormData>({
    resolver: zodResolver(schemaUsername),
  });

  const router = useRouter();

  async function handlePreRegister(data: IPropsClainUsernameFormData) {
    console.log(data);

    await router.push(`/register?username=${data.username}`);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handlePreRegister)}
        className="bg-slate-900 rounded-lg flex p-5 gap-4"
      >
        <input
          type="text"
          prefix="ignite.com/"
          placeholder="seu userName"
          className="bg-black rounded-xl px-4 flex-1 focus:border focus:border-green-500 focus:outline-none"
          {...register("username")}
        />
        <button
          type="submit"
          className="flex bg-red-600 rounded-lg p-3 items-center gap-1 hover:bg-red-400 transition-colors"
          disabled={isSubmitting}
        >
          Registrar <LuArrowRight />
        </button>
      </form>

      <div className="bg-gray-900 p-5 rounded-lg">
        <p
          className={`text-sm ${
            errors.username ? "text-gray-400" : "text-green-500"
          }`}
        >
          - Mínimo de 3 caracteres.
        </p>
        <p
          className={`text-sm ${
            errors.username ? "text-gray-400" : "text-green-500"
          } my-4`}
        >
          - Máximo de 20 caracteres.
        </p>
        <p
          className={`text-sm ${
            errors.username ? "text-gray-400" : "text-green-500"
          }`}
        >
          - Apenas letras e hífens.
        </p>
      </div>
    </>
  );
}
