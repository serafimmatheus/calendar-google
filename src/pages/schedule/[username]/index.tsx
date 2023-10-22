import { prisma } from "@/lib/prisma";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ScheduleForm } from "./scheduleForm";
import { NextSeo } from "next-seo";

interface IPropsUser {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export default function Schedule() {
  const session = useSession();
  const router = useRouter();
  const [user, setUser] = useState<IPropsUser>();

  const { username } = router.query;

  async function handleGetUser() {
    const user = await prisma.user.findUnique({
      where: {
        username: username as string,
      },
    });

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    setUser(user);
  }

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }

    handleGetUser();
  }, [session.status]);

  return (
    <>
      <NextSeo title={`Agendar com ${username} | Ignite Call`} />

      <div className="container flex flex-col w-full justify-center items-center h-screen max-w-2xl m-auto">
        <div className="header-user flex flex-col items-center">
          <div className="w-16 h-16 relative mb-2">
            <Image
              className="rounded-full w-full h-full"
              objectFit="cover"
              src={user?.avatarUrl ?? ""}
              width={100}
              height={100}
              alt="foto de perfil"
            />
          </div>

          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-400 text-base">{user?.bio}</p>
        </div>

        <ScheduleForm />
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
