import Joi from 'joi';
import { CreateMenuReq, PutMenuReq, RoleAddMenusReq, RoleDelMenusReq } from '../dto/SysMenuDto';

// 为某角色删除某个菜单
const roleDelMenusSchema = Joi.object<RoleDelMenusReq>({
  role_id: Joi.number().integer().positive().required().messages({
    'number.base': `角色ID应是数字!`,
    'number.integer': `角色ID应是整数!`,
    'number.positive': `角色ID应是正整数!`,
    'any.required': `缺少字段[role_id]!`
  }),
  menus_id: Joi.array()
    .items(
      Joi.number().integer().positive().messages({
        'number.base': `菜单ID应是数字!`,
        'number.integer': `菜单ID应是整数!`,
        'number.positive': `菜单ID应是正整数!`
      })
    )
    .required()
    .messages({
      'array.base': `菜单ID应是数组!`,
      'any.required': `缺少字段[menus_id]!`
    })
});

export async function roleDelMenuArrayValidator(data: RoleDelMenusReq) {
  await roleDelMenusSchema.validateAsync(data);
}

// 为某角色添加某些菜单
const roleAddMenuArraySchema = Joi.object<RoleAddMenusReq>({
  role_id: Joi.number().integer().positive().required().messages({
    'number.base': `角色ID应是数字!`,
    'number.integer': `角色ID应是整数!`,
    'number.positive': `角色ID应是正整数!`,
    'any.required': `缺少字段[role_id]!`
  }),
  menus_id: Joi.array()
    .items(
      Joi.number().integer().positive().messages({
        'number.base': `菜单ID应是数字!`,
        'number.integer': `菜单ID应是整数!`,
        'number.positive': `菜单ID应是正整数!`
      })
    )
    .required()
    .messages({
      'array.base': `菜单ID应是数组!`,
      'any.required': `缺少字段[menus_id]!`
    })
});

export async function roleAddMenuArrayValidator(data: RoleAddMenusReq) {
  await roleAddMenuArraySchema.validateAsync(data);
}

// 添加角色
const addMenuSchema = Joi.object<CreateMenuReq>({
  menu_name: Joi.string().required().messages({
    'string.base': '菜单名应是字符串!',
    'string.empty': '菜单名不能为空!',
    'any.required': '缺少字段[menu_name]!'
  }),
  description: Joi.string().required().messages({
    'string.base': '描述应是字符串!',
    'string.empty': '描述不能为空!',
    'any.required': '缺少字段[description]!'
  }),
  icon: Joi.string().required().messages({
    'string.base': '图标应是字符串!',
    'string.empty': '图标不能为空!',
    'any.required': '缺少字段[icon]!'
  }),
  uuid: Joi.string().required().messages({
    'string.base': 'UUID应是字符串!',
    'string.empty': 'UUID不能为空!',
    'any.required': '缺少字段[uuid]!'
  }),
  parent_uuid: Joi.string().allow('').required().messages({
    'string.base': '父级UUID应是字符串!',
    'string.empty': '父级UUID不能为空!',
    'any.required': '缺少字段[parent_uuid]!'
  }),
  order_num: Joi.number().integer().required().messages({
    'number.base': '排序号应是数字!',
    'number.integer': '排序号应是整数!',
    'any.required': '缺少字段[order_num]!'
  }),
  shown: Joi.boolean().required().messages({
    'boolean.base': '显示字段应是布尔值!',
    'any.required': '缺少字段[shown]!'
  }),
  is_cache: Joi.boolean().required().messages({
    'boolean.base': '缓存字段应是布尔值!',
    'any.required': '缺少字段[is_cache]!'
  })
});

export async function addMenuValidator(data: CreateMenuReq) {
  await addMenuSchema.validateAsync(data);
}

// 修改角色
const putMenuSchema = Joi.object<PutMenuReq>({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID应是数字!',
    'number.integer': 'ID应是整数!',
    'number.positive': 'ID应是正整数!',
    'any.required': '缺少字段[id]!'
  }),
  menu_name: Joi.string().required().messages({
    'string.base': '菜单名应是字符串!',
    'string.empty': '菜单名不能为空!',
    'any.required': '缺少字段[menu_name]!'
  }),
  description: Joi.string().allow('').required().messages({
    'string.base': '描述应是字符串!',
    'string.empty': '描述不能为空!',
    'any.required': '缺少字段[description]!'
  }),
  icon: Joi.string().allow('').required().messages({
    'string.base': '图标应是字符串!',
    'string.empty': '图标不能为空!',
    'any.required': '缺少字段[icon]!'
  }),
  uuid: Joi.string().required().messages({
    'string.base': 'UUID应是字符串!',
    'string.empty': 'UUID不能为空!',
    'any.required': '缺少字段[uuid]!'
  }),
  parent_uuid: Joi.string().allow('').required().messages({
    'string.base': '父级UUID应是字符串!',
    'string.empty': '父级UUID不能为空!',
    'any.required': '缺少字段[parent_uuid]!'
  }),
  order_num: Joi.number().integer().allow(1).required().messages({
    'number.base': '排序号应是数字!',
    'number.integer': '排序号应是整数!',
    'any.required': '缺少字段[order_num]!'
  }),
  shown: Joi.boolean().allow(false).required().messages({
    'boolean.base': '显示字段应是布尔值!',
    'any.required': '缺少字段[shown]!'
  }),
  is_cache: Joi.boolean().allow(false).required().messages({
    'boolean.base': '缓存字段应是布尔值!',
    'any.required': '缺少字段[is_cache]!'
  })
});

export async function putMenuValidator(data: PutMenuReq) {
  await putMenuSchema.validateAsync(data);
}
