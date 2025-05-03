import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { setCookie, deleteCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .post(
    "/login",
    zValidator(
      "json",
      loginSchema
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(
        email,
        password
      );
      setCookie(c, AUTH_COOKIE, session.secret, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      return c.json({
        sucess: true,
      });
    }
  )
  .post(
    "/register",
    zValidator(
      "json",
      registerSchema
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      const session = await account.createEmailPasswordSession(
        email,
        password
      );
      setCookie(c, AUTH_COOKIE, session.secret, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        sucess: true,
      });
    }
  )
  .post(
    "/logout",
    async (c) => {
      deleteCookie(c, AUTH_COOKIE);
      return c.json({
        sucess: true,
      });
    }
  )


export default app;