'use server'
import {z} from "zod";
import {validateHash} from "@/utils/validate-hash";
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {prismaClient} from "../../../../prisma";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export type Session = {
  uuid: string;
  email: string;
}

const ZodSignInRequestBody = z.object({
  username: z.string(),
  password: z.string(),
});
type SignInRequestBody = z.infer<typeof ZodSignInRequestBody>


export async function signIn(formData: SignInRequestBody) {
  try {
    const data = ZodSignInRequestBody.parse(formData)

    const user = await prismaClient.user.findUnique({where: {username: data.username}})
    if (!user) {
      return {
        data: null,
        error: 'User not found'
      }
    }

    if (!user.salt || !user.hash) {
      return {
        data: null,
        error: 'Sign in failed',
      }
    }

    const validLogin = validateHash(data.password, user.salt, user.hash)
    if (!validLogin) {
      return {
        data: null,
        error: 'Incorrect password',
      }
    }

    const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
    session.uuid = user.uuid;
    if (user.email) session.email = user.email
    await session.save();

  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Unknown error'
    }
  }
  revalidatePath('/')
  redirect('/')
}