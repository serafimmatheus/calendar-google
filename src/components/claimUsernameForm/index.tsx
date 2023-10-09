import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";

type IPropsClainUsernameFormData = {
  username: string;
};

export default function ClaimUsernameForm() {
  const { register, handleSubmit } = useForm<IPropsClainUsernameFormData>();

  async function handlePreRegister(data: IPropsClainUsernameFormData) {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(handlePreRegister)}
      className="bg-slate-900 rounded-lg flex p-5 gap-4"
    >
      <input
        type="text"
        prefix="ignite.com/"
        placeholder="seu nome"
        className="bg-black rounded-xl px-4 flex-1 focus:border focus:border-green-500 focus:outline-none"
        {...register("username")}
      />
      <button
        type="submit"
        className="flex bg-red-600 rounded-lg p-3 items-center gap-1 hover:bg-red-400 transition-colors"
      >
        Registrar <LuArrowRight />
      </button>
    </form>
  );
}
