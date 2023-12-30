using Zhuz.net.SysModels.SysFile;

namespace Zhuz.net.SysServices;

public interface ISysFileService
{
    /// <summary>
    /// 将某个文件数据存储至目标文件
    /// </summary>
    /// <param name="saveFileDataOption"></param>
    /// <returns></returns>
    public Task<string> SaveFileDataToTarget(SysSaveFileDataToTargetModel saveFileDataOption);
}