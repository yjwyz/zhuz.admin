namespace Zhuz.net.BaseModels.Edit;

public class EditOptionsModel
{
    public string AvatarFinderName { get; init; } // 头像目录名
    public string TempFinderName { get; init; } // 临时目录名
    public string AvatarFormats { get; init; } // 头像文件格式限制
    public int AvatarMaxSize { get; init; } // 头像文件大小限制,单位: M
    public string InitPass { get; init; } // 账号初始密码
}