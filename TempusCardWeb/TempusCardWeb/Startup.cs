using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TempusCardWeb.Startup))]
namespace TempusCardWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
