import { SysMenuEntity } from '../entity/Init';
import { CreateMenuReq, PutMenuReq } from '../types/dto/SysMenuDto';
import { HttpException } from '../utils/ResUtil';
import { groupBy } from 'lodash';

export default class SysMenuService {
  /**
   * 查看所有菜单
   */
  static async findAllMenu() {
    const menus = await SysMenuEntity.findAll();
    return menus.map((menu) => menu.get({ plain: true }));
  }
  /**
   * 更新/读取/删除一个角色
   * @param menuId
   */
  static async urdMenu(menuId: number, mode: 'U' | 'R' | 'D', putParams?: PutMenuReq) {
    const menu = await SysMenuEntity.findOne({ where: { id: menuId } });
    if (!menu) {
      throw new HttpException('没有此菜单!');
    }
    if (mode == 'D') {
      await menu.destroy();
    } else if (mode == 'U') {
      menu.menu_name = putParams?.menu_name ?? menu.menu_name;
      menu.description = putParams?.description ?? menu.description;
      menu.icon = putParams?.icon ?? menu.icon;
      menu.uuid = putParams?.uuid ?? menu.uuid;
      menu.parent_uuid = putParams?.parent_uuid as string;
      menu.order_num = putParams?.order_num ?? menu.order_num;
      menu.shown = putParams?.shown as boolean;
      menu.is_cache = putParams?.is_cache as boolean;
      await menu.save();
    }
    return menu.dataValues;
  }
  /**
   * 添加一条菜单
   * @param req
   * @returns
   */
  static async createMenu(req: CreateMenuReq) {
    const [menu, created] = await SysMenuEntity.findOrCreate({
      where: { uuid: req.uuid },
      defaults: req
    });
    if (!created) {
      throw new HttpException('此菜单已经存在!');
    }
    return menu.dataValues;
  }
  /**
   * 扁平化菜单数据树形处理
   */
  static menuBuildTree(menus: any[], parent_uuid: string) {
    menus.sort((a, b) => a.order_num - b.order_num);
    const groupedData = groupBy(menus, parent_uuid);
    const buildTree = (parentUUID: string): any => {
      const children = groupedData[parentUUID] || [];
      return children.map((child: any) => {
        return {
          ...child,
          children: buildTree(child.uuid)
        };
      });
    };
    const treeData = buildTree('');

    return treeData;
  }
}
