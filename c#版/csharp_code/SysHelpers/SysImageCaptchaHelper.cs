using SkiaSharp;

namespace Zhuz.net.SysHelpers;

/// <summary>
/// 图片验证码
/// </summary>
public class SysImageCaptchaHelper
{
    public SysImageCaptchaHelper(int Width, int Height)
    {
        // crate a surface
        var info = new SKImageInfo(Width, Height);

        Surface = SKSurface.Create(info);

        // 设置字体,解决乱码
        var fontManager = SKFontManager.Default;
        EmojiTypeface = fontManager.MatchCharacter('赵');

        Random1 = new Random();
    }

    SKSurface Surface;
    SKTypeface EmojiTypeface;
    Random Random1;

    /// <summary>
    /// 背景色
    /// </summary>
    public byte BackColorR = 255;

    /// <summary>
    /// 背景色
    /// </summary>
    public byte BackColorG = 255;

    /// <summary>
    /// 背景色
    /// </summary>
    public byte BackColorB = 255;

    /// <summary>
    /// 防靠色偏差值
    /// </summary>
    public byte BackOffset = 40;

    /// <summary>
    /// 字体大小
    /// </summary>
    int TextSize = 30;


    /// <summary>
    /// R限制范围
    /// </summary>
    public (byte begin, byte end, byte length) BoundsR
    {
        get { return Bounds(BackColorR); }
    }

    /// <summary>
    /// R限制范围
    /// </summary>
    public (byte begin, byte end, byte length) BoundsG
    {
        get { return Bounds(BackColorG); }
    }

    /// <summary>
    /// R限制范围
    /// </summary>
    public (byte begin, byte end, byte length) BoundsB
    {
        get { return Bounds(BackColorB); }
    }

    /// <summary>
    /// 颜色取值,限制范围
    /// </summary>
    /// <param name="Value"></param>
    /// <returns></returns>
    private (byte begin, byte end, byte length) Bounds(byte Value)
    {
        (byte begin, byte end, byte length) res = (0, 0, 0);

        res.begin = (byte)Math.Max(0, Value - BackOffset);
        res.end = (byte)Math.Min(255, Value + BackOffset);
        res.length = (byte)(res.end - res.begin);

        return res;
    }

    /// <summary>
    /// 清除图像,保留背景色
    /// </summary>
    public void Clear()
    {
        // the the canvas and properties
        var canvas = Surface.Canvas;
        // make sure the canvas is blank
        canvas.Clear(new SKColor(BackColorR, BackColorG, BackColorB));
    }

    /// <summary>
    /// 写文字
    /// </summary>
    /// <param name="Text"></param>
    public void WriteText(string Text)
    {
        var canvas = Surface.Canvas;
        var xPoint = 6; ///x点
        var yPoint = (Surface.Canvas.DeviceClipBounds.Height + TextSize) / 2; ///y点
        // draw some text
        var paint = new SKPaint
        {
            Color = SKColors.Black,
            IsAntialias = true,
            Style = SKPaintStyle.Fill,
            TextAlign = SKTextAlign.Left,
            TextSize = TextSize,
            TextEncoding = SKTextEncoding.Utf8,
            Typeface = EmojiTypeface,
            StrokeWidth = 3
            // TextSkewX = 3
        };
        for (int i = 0; i < Text.Length; i++)
        {
            ///偏移
            int xOffset = Random1.Next(-TextSize * 2 / 10, 1); ///x偏移
            int yOffset = Random1.Next(-3, 3); ///y偏移
            int angleOffset = Random1.Next(-15, 15); ///角度偏移
            paint.Color = RandColoe(); ///随机颜色

            canvas.RotateDegrees(angleOffset, xPoint + xOffset, yPoint + yOffset);
            canvas.DrawText(Text[i].ToString(), xPoint + xOffset, yPoint + yOffset, paint);

            canvas.RotateDegrees(-angleOffset, xPoint + xOffset, yPoint + yOffset);
            // xPoint = xPoint + xOffset + TextSize;
            xPoint = xPoint + TextSize + xOffset;
        }
    }

    /// <summary>
    /// 混淆
    /// </summary>
    public void Confuse(uint Count)
    {
        // the the canvas and properties
        var canvas = Surface.Canvas;

        for (int i = 0; i < Count; i++)
        {
            int x = Random1.Next(0, canvas.DeviceClipBounds.Width);
            int y = Random1.Next(0, canvas.DeviceClipBounds.Height);
            int radius = Random1.Next(TextSize, TextSize * 2);

            var paint = new SKPaint
            {
                Color = RandColoe(), ///随机颜色
                IsAntialias = true,
                Style = SKPaintStyle.Stroke,
                TextAlign = SKTextAlign.Left,
                TextSize = TextSize,
                TextEncoding = SKTextEncoding.Utf8,
                Typeface = EmojiTypeface,
                StrokeWidth = 1
                // TextSkewX = 3
            };


            canvas.DrawCircle(x, y, radius, paint);
        }
    }

    /// <summary>
    /// 生成和背景具有区分的随机颜色
    /// </summary>
    /// <returns></returns>
    private SKColor RandColoe()
    {
        ///随机颜色,以背景色为基准,,取随机值,防止靠色
        ///0    128     256

        ///r值
        var r = Random1.Next(0, 255 - BoundsR.length);
        if (r > BoundsR.begin && r < BoundsR.end)
        {
            r = (r + BoundsR.length) % 256;
        }

        ///g值
        var g = (r + Random1.Next(50, 190)) % 256;

        if (g > BoundsG.begin && g < BoundsG.end)
        {
            g = (g + BoundsG.length) % 256;
        }

        ///b值
        var b = (g + Random1.Next(50, 190)) % 256;
        if (b > BoundsB.begin && b < BoundsB.end)
        {
            b = (b + BoundsB.length) % 256;
        }


        return new SKColor((byte)r, (byte)g, (byte)b);
    }

    /// <summary>
    /// 获取图片流,png格式
    /// </summary>
    /// <returns></returns>
    public byte[] GetImg()
    {
        MemoryStream stream;
        // save the file
        using (var image = Surface.Snapshot())
        using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
        {
            return data.ToArray();
        }
    }

    /// <summary>
    /// 一键生成验证图片
    /// </summary>
    /// <returns></returns>
    public byte[] CreateVerificationImage(string Text)
    {
        Clear();
        WriteText(Text);
        Confuse(4);
        var stream = GetImg();

        return stream;
    }
}