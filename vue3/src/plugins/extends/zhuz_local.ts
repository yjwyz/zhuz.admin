// 存储数据到 localStorage，可以设置过期时间（单位：毫秒）
export function appLocal_Set(key: string, value: any, expiryMs: number): void {
  try {
    const now = new Date().getTime();
    const item = {
      value,
      expiry: expiryMs === 0 ? 0 : now + expiryMs, // 如果过期时间为0，则永不过期
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
}

// 从 localStorage 获取数据，如果数据已过期则返回null
export function appLocal_Get<T>(key: string, dv: T): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return dv;
    }
    const parsedItem = JSON.parse(item);
    const now = new Date().getTime();
    if (parsedItem.expiry === 0 || parsedItem.expiry >= now) {
      return parsedItem.value;
    } else {
      localStorage.removeItem(key); // 如果数据已过期，删除它
      return dv;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return dv;
  }
}

// 从 localStorage 删除数据
export function appLocal_Remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
  }
}

// 清空 localStorage
export function appLocal_Clear(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
}
