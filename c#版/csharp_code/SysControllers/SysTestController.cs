using Microsoft.AspNetCore.Mvc;
using Zhuz.net.SysServices;
using Zhuz.net.SysHelpers;

namespace Zhuz.net.SysControllers;

[ApiController]
[Route("test")]
public class SysTestController:ControllerBase
{
    private readonly ISysRedisService _redisService;
    public SysTestController(ISysRedisService redis,IHttpClientFactory httpClientFactory)
    {
        _redisService = redis;
    }
    
    [HttpGet("get")]
    public async Task<int> TestGet()
    {
        int ver=await _redisService.TestRedis();
        return ver;
    }

    [HttpGet("captcha")]
    public IActionResult GetCaptcha()
    {
        SysImageCaptchaHelper iCode = new SysImageCaptchaHelper(135, 40);
        iCode.Clear();
        iCode.WriteText("eb4f");
        iCode.Confuse(1);
        var img = iCode.GetImg();
        return File(img, "image/png");
    }
}