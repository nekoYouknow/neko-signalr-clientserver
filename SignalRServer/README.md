# SignalR-server
- SignalR sample Server side...
- Step 01 : Asp.net core 3.1 + Web Application
- Step 02 : SignalR Hub 만들기
```
[/Hubs/TestHub.cs]
//A
using Microsoft.AspNetCore.SignalR;

namespace SignalRServer.Hubs
{
    //B : ext Hub
    public class TestHub : Hub 
    {
        //명시적으로 id 얻고 싶다면...
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        //Clients.All : 브로드케스트 (연결된 모든 클라이언트에 메시지 보냄)
        public async Task Ping()
        {
            var message = "Pong " + DateTime.Now.ToString() ;
            await Clients.All.SendAsync("PingReceive", message);
        }

        //Clients.Client : 호출한 클라이언트에게만 메시지 보냄 
        public async Task EchoMe()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("EchoMeReceive", "Echo me");
        }


        //스트리밍 : 호출한 클라이언트에게만 응답
        public async IAsyncEnumerable<int> Progress()
        {
            for(var i=0; i<=100; i++)
            {
                await Task.Delay(200);
                yield return i;
            }
        }

        //스트리밍 : 호출한 클라이언트에게만 응답
        public async IAsyncEnumerable<dynamic> ProgDynamic()
        {
            List<dynamic> list = new List<dynamic>();

            #region
            dynamic a = new ExpandoObject();
            a.id = 1;
            a.name = "a";
            list.Add(a);

            dynamic b = new ExpandoObject();
            b.id = 2;
            b.name = "b";
            list.Add(b);

            dynamic c = new ExpandoObject();
            c.id = 3;
            c.name = "c";
            list.Add(c);
            #endregion

            foreach(var x in list)
            {
                await Task.Delay(200);
                yield return x;
            }
        }
    }
}
```
- Step 03 : 서버구성 (설정)
```
[Startup.cs]
using SignalRServer.Hubs;

namespace SignalRServer
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder.AllowAnyMethod().AllowAnyHeader().AllowCredentials().SetIsOriginAllowed((host) => true).Build());
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<TestHub>("/testhub");
            });
        }
    }
}

```
- Step 04 : Run and wait / http://localhost:44354/




