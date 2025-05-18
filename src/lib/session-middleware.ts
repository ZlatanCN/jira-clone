import 'server-only';
import { createMiddleware } from 'hono/factory';
import {
  Account,
  type Account as AccountType,
  Client,
  Databases,
  type Databases as DatabasesType,
  Models,
  Storage,
  type Storage as StorageType,
  type Users as UsersType,
} from 'node-appwrite';
import { getCookie } from 'hono/cookie';
import { AUTH_COOKIE } from '@/features/auth/constants';

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: '未授权' }, 401);
    }

    client.setSession(session);

    const [account, databases, storage] = [
      new Account(client),
      new Databases(client),
      new Storage(client),
    ];

    const user = await account.get();

    c.set('account', account);
    c.set('databases', databases);
    c.set('storage', storage);
    c.set('user', user);

    await next();
  },
);

export { sessionMiddleware };
