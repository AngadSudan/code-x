import { createClient } from "redis";

import type { RedisClientInterface } from "./type";
class RedisClient implements RedisClientInterface {
  client: any;
  url: string;
  isConnected: boolean;
  password: string;
  constructor(uri: string, password: string) {
    this.password = password;
    this.url = uri;
    this.isConnected = false;
    this.client = null;
  }

  async createClient() {
    this.client = createClient({
      url: this.url,
      password: this.password,
    });
  }

  async connectToClient() {
    if (!this.client) {
      this.createClient();
    }
    if (this.isConnected) return;

    try {
      await this.client.connect();
      this.isConnected = true;
      const exists = await this.client.exists("usersBloom");

      if (!exists) {
        await this.client.bf.reserve("usersBloom", 0.01, 10000);
      }
    } catch (error: any) {
      console.log("Redis connection error: ", error);
      process.exit(1);
    }
  }
  async setCache(key: string, message: any) {
    try {
      await this.client.set(key, JSON.stringify(message));
    } catch (error) {
      console.log("Redis upload error: ", error);
    }
  }
  async invalidateCache(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.log("Redis invalidation error: ", error);
    }
  }
  async getCache(key: string) {
    try {
      const data = await this.client.get(key);
      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      console.log("Redis upload error: ", error);
    }
  }
  async checkInBF(key: string) {
    try {
      const data = await this.client.bf.exists("usersBloom", key);
      return data;
    } catch (error) {
      console.log("Redis Bloom Filter error: ", error);
    }
  }
  async setInBF(key: string) {
    try {
      const data = await this.client.bf.add("usersBloom", key);
      return data;
    } catch (error) {
      console.log("Redis Bloom Filter error: ", error);
    }
  }
  async clearAllCache() {
    let cursor = "0";

    do {
      const result = await this.client.scan(cursor, {
        MATCH: "*",
        COUNT: 100,
      });

      cursor = result.cursor;

      for (const key of result.keys) {
        const type = await this.client.type(key);
        console.log(key);
        if (key === "usersBloom") continue;
        if (type === "string") {
          await this.client.del(key);
        }
      }
    } while (cursor !== "0");

    console.log("String cache cleared safely.");
  }
}

export default RedisClient;
