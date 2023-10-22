import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  observation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  handleClearSelectedDateTime: () => void;
}

export function ConfirmStep({
  schedulingDate,
  handleClearSelectedDateTime,
}: ConfirmStepProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const { username } = router.query;

  const describeDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ] YYYY");
  const describeTime = dayjs(schedulingDate).format("HH:mm");

  async function handleConfirmStep(data: FormData) {
    await api
      .post(`/users/${username}/scheduling`, {
        name: data.name,
        email: data.email,
        observation: data.observation,
        date: schedulingDate,
      })
      .then((res) => {
        handleClearSelectedDateTime();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="bg-gray-900 max-w-xl w-full rounded-md flex px-6 flex-col mt-6">
      <header className="flex w-full gap-8 border-b border-gray-600 p-6">
        <div className="flex items-center gap-2 ">
          <AiOutlineCalendar class="text-gray-400" size={20} />
          <p className="text-gray-300 text-base">{describeDate}</p>
        </div>

        <div className="flex items-center gap-2 ">
          <MdOutlineWatchLater class="text-gray-400" size={20} />
          <p className="text-gray-300 text-base">{describeTime}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(handleConfirmStep)}>
        <label className="flex flex-col mt-6">
          <p className="text-gray-400 text-base mb-2">Seu nome</p>
          <input
            className={`placeholder:text-gray-600 h-11 rounded-lg outline-none bg-gray-950 px-4 mb-2`}
            type="text"
            prefix="cal.com/"
            placeholder="Seu nome"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </label>

        <label className="flex flex-col mt-6">
          <p className="text-gray-400 text-base mb-2">Endereço de e-mail</p>
          <input
            className={`placeholder:text-gray-600 h-11 rounded-lg outline-none bg-gray-950 px-4 mb-2`}
            type="text"
            prefix="cal.com/"
            placeholder="Endereço de e-mail"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col mt-6">
          <p className="text-gray-400 text-base mb-2">Observações</p>
          <textarea
            className={`placeholder:text-gray-600 p-2 h-20 resize-none rounded-lg outline-none bg-gray-950 px-4 mb-2`}
            prefix="cal.com/"
            placeholder="Observações"
            {...register("observation")}
          />
        </label>

        <footer className="flex justify-end py-6">
          <button
            onClick={handleClearSelectedDateTime}
            type="button"
            className="py-3 px-6"
          >
            Cancelar
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="py-3 px-6 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Confirmar
          </button>
        </footer>
      </form>
    </div>
  );
}
