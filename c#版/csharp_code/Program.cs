using Autofac;
using Autofac.Extensions.DependencyInjection;
using Zhuz.net.SysExtends;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#region 系统扩展
var configuration = builder.Configuration;
{
    builder.Services.AddServiceCollectionModule(configuration);
    builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
    builder.Host.ConfigureContainer<ContainerBuilder>(builderParam =>
    {
        builderParam.AddAutofacModule(configuration);
    });
}
#endregion


var app = builder.Build();

#region 系统扩展
{
    app.AddWebApplicationModule(configuration);
}
#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();