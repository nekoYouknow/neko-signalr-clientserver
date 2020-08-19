using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Threading.Tasks;

//A
using Microsoft.AspNetCore.SignalR;

namespace SignalRServer.Hubs
{
    public class TestHub : Hub  //B
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
