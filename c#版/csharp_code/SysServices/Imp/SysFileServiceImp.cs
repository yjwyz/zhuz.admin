using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.SysFile;

namespace Zhuz.net.SysServices.Imp;

public class SysFileServiceImp:ISysFileService
{
    public async Task<string> SaveFileDataToTarget(SysSaveFileDataToTargetModel saveFileDataOption)
    {
        if (saveFileDataOption.File == null || saveFileDataOption.File.Length <= 0)
        {
            throw new Exception("需要处理的文件无效!");
        }
        if (saveFileDataOption.File.Length > saveFileDataOption.MaxSize * 1024 * 1024)
        {
            throw new Exception("需要处理的文件超出大小限制!");
        }
        int count = saveFileDataOption.File.FileName.Split('.').Length;//统计.将名字分为几个部分
        string exp = saveFileDataOption.File.FileName.Split('.')[count - 1];//最后一部分为后缀名
        if (!saveFileDataOption.Formats.Contains(exp))
        {
            throw new Exception("需要处理的文件格式不正确!");
        }

        string targetFinderPath = SysFileHelper.CreateStaticFinder(saveFileDataOption.TargetFinderName);
        string newFileName =
            $"{Path.GetFileNameWithoutExtension(saveFileDataOption.File.FileName)}_{SysTimeHelper.GetNowTimestamp()}.{exp}";
        string targetFilePath = targetFinderPath+"/"+newFileName;
        if (!File.Exists(targetFilePath))
        {
            FileStream fs = File.Create(targetFilePath);
            fs.Close();
        }

        await using (var stream = new FileStream(targetFilePath, FileMode.Create))
        {
            await saveFileDataOption.File.CopyToAsync(stream);
        }
        return saveFileDataOption.TargetFinderName + "/" + newFileName;
    }
}