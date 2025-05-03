import 'server-only';
import { Account, Client } from 'node-appwrite';

/**
 * 创建一个具有管理员权限的 Appwrite 客户端实例
 *
 * 此函数用于初始化一个 Appwrite 客户端，并通过环境变量配置必要的连接信息，
 * 以便进行管理用户和数据等后台操作。
 */
export async function createAdminClient () {
  // 创建一个新的客户端实例，并设置 Appwrite 的服务地址、项目 ID 和 API 密钥
  const client = new Client().setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // 设置 Appwrite 服务的端点地址
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!) // 设置项目 ID
    .setKey(process.env.NEXT_APPWRITE_KEY!); // 设置管理员 API 密钥

  // 返回一个包含 getter 的对象，用于访问账户管理功能
  return {
    /**
     * 获取 Account 实例
     *
     * 这是一个 getter 方法，用于获取与当前客户端绑定的账户管理实例，
     * 可以用来执行如创建用户、查询用户等账户相关操作。
     */
    get account () {
      return new Account(client); // 创建并返回 Account 实例
    },
  };
}

