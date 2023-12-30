import __ISysMenu__ from './SysMenuEntity';
import __ISysMenuList__ from './SysMenuListEntity';
import __ISysRole__ from './SysRoleEntity';
import __ISysRoleList__ from './SysRoleListEntity';
import __ISysUser__ from './SysUserEntity';

const SysMenuEntity = __ISysMenu__;
const SysMenuListEntity = __ISysMenuList__;
const SysRoleEntity = __ISysRole__;
const SysRoleListEntity = __ISysRoleList__;
const SysUserEntity = __ISysUser__;

SysUserEntity.hasMany(SysRoleListEntity, {
  as: 'sys_role_lists',
  foreignKey: 'user_id'
});
SysRoleListEntity.belongsTo(SysRoleEntity, {
  as: 'role',
  foreignKey: 'role_id',
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT'
});
SysRoleListEntity.belongsTo(SysUserEntity, {
  as: 'user',
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT'
});
SysRoleEntity.hasMany(SysRoleListEntity, {
  as: 'sys_role_lists',
  foreignKey: 'role_id'
});
SysRoleEntity.hasMany(SysMenuListEntity, {
  as: 'sys_menu_lists',
  foreignKey: 'role_id'
});
SysMenuListEntity.belongsTo(SysMenuEntity, {
  as: 'menu',
  foreignKey: 'menu_id',
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT'
});
SysMenuListEntity.belongsTo(SysRoleEntity, {
  as: 'role',
  foreignKey: 'role_id',
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT'
});
SysMenuEntity.hasMany(SysMenuListEntity, {
  as: 'sys_menu_lists',
  foreignKey: 'menu_id'
});

export { SysMenuEntity, SysMenuListEntity, SysRoleEntity, SysRoleListEntity, SysUserEntity };
