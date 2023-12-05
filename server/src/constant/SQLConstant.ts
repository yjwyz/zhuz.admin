// 查询数据库中表的数量
export const GetDatabaseTableCountQeuryStr =
  "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';";
