import Joi from 'joi';
import { LoginReq, PutPasswordReq, RegisterReq } from '../dto/SysUserDto';

// 修改当前用户密码
const putPasswordSchema = Joi.object({
  oldPass: Joi.string().required().messages({
    'string.base': `旧密码应是字符串!`,
    'string.empty': `需要填写好旧密码!`,
    'any.required': `缺少字段[oldPass]!`
  }),
  newPass: Joi.string().required().messages({
    'string.base': `新密码应是字符串!`,
    'string.empty': `需要填写好新密码!`,
    'any.required': `缺少字段[newPass]!`
  }),
  confirmPass: Joi.string().required().valid(Joi.ref('newPass')).messages({
    'any.only': '重复密码与新密码不一致!',
    'any.required': '缺少字段[confirmPass]!'
  })
});

export async function putPasswordValidator(data: PutPasswordReq) {
  await putPasswordSchema.validateAsync(data);
}

// 注册
const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': `用户名应是字符串!`,
    'string.empty': `需要填写好用户名!`,
    'any.required': `缺少字段[username]!`
  }),
  password: Joi.string().required().messages({
    'string.base': `密码应是字符串!`,
    'string.empty': `需要填写好密码!`,
    'any.required': `缺少字段[password]!`
  }),
  repeat_password: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': '重复密码与密码不一致!',
    'any.required': '缺少字段[repeat_password]!'
  }),
  code: Joi.string().required().messages({
    'string.base': `验证码应是字符串!`,
    'string.empty': `需要填写好验证码!`,
    'any.required': `缺少字段[code]!`
  }), // 验证码
  uuid: Joi.string().required().messages({
    'string.base': `UUID应是字符串!`,
    'string.empty': `需要填写好UUID!`,
    'any.required': `缺少字段[uuid]!`
  }) // 会话id
}).with('password', 'repeat_password');
export async function registerValidate(data: RegisterReq) {
  await registerSchema.validateAsync(data);
}

// 登录
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': `用户名应是字符串!`,
    'string.empty': `需要填写好用户名!`,
    'any.required': `缺少字段[username]!`
  }),
  password: Joi.string().required().messages({
    'string.base': `密码应是字符串!`,
    'string.empty': `需要填写好密码!`,
    'any.required': `缺少字段[password]!`
  }),
  code: Joi.string().required().messages({
    'string.base': `验证码应是字符串!`,
    'string.empty': `需要填写好验证码!`,
    'any.required': `缺少字段[code]!`
  }), // 验证码
  uuid: Joi.string().required().messages({
    'string.base': `UUID应是字符串!`,
    'string.empty': `需要填写好UUID!`,
    'any.required': `缺少字段[uuid]!`
  }) // 会话id
});

export async function loginValidate(data: LoginReq) {
  await loginSchema.validateAsync(data);
}
