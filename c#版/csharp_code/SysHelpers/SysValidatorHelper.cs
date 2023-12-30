using FluentValidation;
using FluentValidation.Results;

namespace Zhuz.net.SysHelpers;

public static class SysValidatorHelper
{
    /// <summary>
    /// 校验参数
    /// </summary>
    /// <param name="rule"></param>
    /// <param name="req"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public static async Task<bool> Check<T>(AbstractValidator<T> rule,T req)
    {
        ValidationResult ruleValidatorResult =await rule.ValidateAsync(req);
        if (!ruleValidatorResult.IsValid)
        {
            throw new Exception(ruleValidatorResult.Errors[0].ErrorMessage);
        }

        return true;
    }
}