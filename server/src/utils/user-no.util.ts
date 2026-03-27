import dayjs from 'dayjs';

// TODO: 需要注入 Redis 服务
// 这里只是一个示例实现，实际需要使用 Redis 来保证序号的唯一性

let sequence = 0;

export async function generateUserNo(): Promise<string> {
  const today = dayjs().format('YYYYMMDD');
  
  // 实际实现应该使用 Redis 自增
  // const key = `user:no:${today}`;
  // const seq = await redis.incr(key);
  // if (seq === 1) {
  //   await redis.expire(key, 7 * 24 * 60 * 60);
  // }
  
  sequence++;
  const seqStr = sequence.toString().padStart(6, '0');
  
  return `U${today}${seqStr}`;
}
