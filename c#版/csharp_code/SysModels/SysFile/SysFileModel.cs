namespace Zhuz.net.SysModels.SysFile;

public class SysSaveFileDataToTargetModel
{
    public IFormFile? File { get; init; } // 源文件
    public int MaxSize { get; init; } // 文件最大限制,单位: M
    public string[] Formats { get; init; } // 文件格式限制
    public string TargetFinderName { get; init; }// 目标目录名
}


