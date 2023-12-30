import Joi from 'joi';
import { CreateRoleReq, PutRoleReq } from '../dto/SysRoleDto';
import { CreateRoleListReq, DelRoleListReq } from '../dto/SysRoleListDto';

// 删除某账户某个角色
const delUserRoleSchema = Joi.object<any, false, DelRoleListReq>({
  role_id: Joi.number().integer().positive().required().messages({
    'number.base': `角色ID应是数字!`,
    'number.integer': `角色ID应是整数!`,
    'number.positive': `角色ID应是正整数!`,
    'any.required': `缺少字段[role_id]!`
  }),
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': `用户ID应是数字!`,
    'number.integer': `用户ID应是整数!`,
    'number.positive': `用户ID应是正整数!`,
    'any.required': `缺少字段[user_id]!`
  })
});
export async function delUserRoleValidator(data: DelRoleListReq) {
  await delUserRoleSchema.validateAsync(data);
}

// 为某账户添加角色
const userAddRoleSchema = Joi.object<any, false, CreateRoleListReq>({
  role_id: Joi.number().integer().positive().required().messages({
    'number.base': `角色ID应是数字!`,
    'number.integer': `角色ID应是整数!`,
    'number.positive': `角色ID应是正整数!`,
    'any.required': `缺少字段[role_id]!`
  }),
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': `用户ID应是数字!`,
    'number.integer': `用户ID应是整数!`,
    'number.positive': `用户ID应是正整数!`,
    'any.required': `缺少字段[user_id]!`
  })
});
export async function userAddRoleValidator(data: CreateRoleListReq) {
  await userAddRoleSchema.validateAsync(data);
}

// 添加角色
const addRoleSchema = Joi.object<any, false, CreateRoleReq>({
  role_name: Joi.string().required().messages({
    'string.base': `角色名应是字符串!`,
    'string.empty': `角色名不能为空!`,
    'any.required': `缺少字段[role_name]!`
  })
});

export async function addRoleValidator(data: CreateRoleReq) {
  await addRoleSchema.validateAsync(data);
}

// 修改角色
const putRoleSchema = Joi.object<any, false, PutRoleReq>({
  role_id: Joi.number().integer().positive().required().messages({
    'number.base': `角色ID应是数字!`,
    'number.integer': `角色ID应是整数!`,
    'number.positive': `角色ID应是正整数!`,
    'any.required': `缺少字段[role_id]!`
  }),
  role_name: Joi.string().required().messages({
    'string.base': `角色名应是字符串!`,
    'string.empty': `角色名不能为空!`,
    'any.required': `缺少字段[role_name]!`
  })
});

export async function putRoleValidator(data: PutRoleReq) {
  await putRoleSchema.validateAsync(data);
}
