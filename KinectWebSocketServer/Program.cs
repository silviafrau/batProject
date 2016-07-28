using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using KinectV2NodeWrapper;
using PlatformWebController;

namespace KinectWebSocketServer
{
    class Program
    {
        static void Main(string[] args)
        {
            //var serverSocket = new WebSocketServer(System.Net.IPAddress.Parse("192.168.1.134"), 8787);
            var serverSocket = new WebSocketServer(System.Net.IPAddress.Parse("127.0.0.1"), 8787);
            KinectFusionWrapper singleton = KinectFusionWrapper.GetInstance();
            singleton.Start();
            serverSocket.AddWebSocketService<KinectFusionBehaviour>("/Kinect2/KinectFusion");
            serverSocket.AddWebSocketService<KinectBehaviour>("/Kinect2/Kinect");
            serverSocket.AddWebSocketService<PlatformBehaviour>("/Platform");
            serverSocket.Start();
            Console.ReadKey(true);
            serverSocket.Stop();
            singleton.Stop();
        }
    }
}
