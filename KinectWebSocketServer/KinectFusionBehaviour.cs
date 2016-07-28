using System;
using WebSocketSharp.Server;
using KinectV2NodeWrapper;
using WebSocketSharp;
using System.IO;
using System.IO.Compression;


namespace KinectWebSocketServer
{

    class KinectFusionBehaviour : WebSocketBehavior
    {
        const byte ReconstructionImage = 1;
        const byte ColorTexture = 2;
        const byte NormalTexture = 3;
        const byte VolumeTexture = 4;
        const byte PauseIntegration = 5;
        const byte ResetReconstruction = 6;
        const byte FindCameraPose = 7;
        const byte KinectView = 8;
        const byte MirrorDepth = 9;
        const byte DepthRange = 10;
        const byte IntegrationWeight = 11;
        const byte VoxelPerMeter = 12;
        const byte VoxelsX = 13;
        const byte VoxelsY = 14;
        const byte VoxelsZ = 15;
        const byte ResetCamera = 16;
        const byte CreateMesh = 17;
        const byte CreateMeshCompleted = 18;

        byte[] buffer ;
        protected override void OnOpen()
        {
            base.OnOpen();
            KinectFusionWrapper singleton = KinectFusionWrapper.GetInstance();
                buffer = new byte[10*1024*1024];
            singleton.OnReconstructionFrame += Singleton_OnReconstructionFrame;
            //singleton.Start();
            Console.WriteLine("KinectFusion Started");
            
        }

        int count = 0;
        private const int SKIP = 2;
        private void Singleton_OnReconstructionFrame(ref int[] pixels)
        {

            //217088
            //if(count % SKIP == 0)
            {
                buffer[0] = ReconstructionImage;
                Buffer.BlockCopy(pixels, 0, buffer, 1, pixels.Length * sizeof(int));
                Send(CommunicationUtils.Compress(buffer, pixels.Length * sizeof(int) + 1));
                count = 0;
            }
            count++;
            
          
        }

       

        protected override void OnMessage(MessageEventArgs e)
        {
            base.OnMessage(e);
            KinectFusionWrapper singleton = KinectFusionWrapper.GetInstance();
            if (e.IsBinary)
            {
                switch (e.RawData[0])
                {
                    case ColorTexture:
                        singleton.DisplayNormals = false;
                        singleton.CaptureColor = true;
                        break;

                    case NormalTexture:
                        singleton.CaptureColor = false;
                        singleton.DisplayNormals = true;
                        break;

                    case VolumeTexture:
                        singleton.CaptureColor = false;
                        singleton.DisplayNormals = false;
                        break;

                    case PauseIntegration:
                        singleton.PauseIntegration = e.RawData[1] == 1;
                        break;

                    case ResetReconstruction:
                        singleton.ResetReconstruction();
                        break;

                    case FindCameraPose:
                        singleton.UseCameraPoseFinder = e.RawData[1] == 1;
                        break;

                    case KinectView:
                        singleton.KinectView = e.RawData[1] == 1;
                        break;

                    case MirrorDepth:
                        singleton.MirrorDepth = e.RawData[1] == 1;
                        break;

                    case DepthRange:
                        double min = BitConverter.ToDouble(e.RawData, 8);
                        double max = BitConverter.ToDouble(e.RawData, 16);
                        singleton.MinDepthClip = min;
                        singleton.MaxDepthClip = max;
                        break;

                    case IntegrationWeight:
                        int val = BitConverter.ToInt16(e.RawData, 8);
                        singleton.IntegrationWeight = val;
                        break;

                    case VoxelPerMeter:
                        val = BitConverter.ToInt16(e.RawData, 8);
                        singleton.VoxelsPerMeter = val;
                        break;

                    case VoxelsX:
                        val = BitConverter.ToInt16(e.RawData, 8);
                        singleton.VoxelsX = val;
                        break;

                    case VoxelsY:
                        val = BitConverter.ToInt16(e.RawData, 8);
                        singleton.VoxelsY = val;
                        break;

                    case VoxelsZ:
                        val = BitConverter.ToInt16(e.RawData, 8);
                        singleton.VoxelsZ = val;
                        break;

                    case ResetCamera:
                        singleton.ResetCamera();
                        break;

                    case CreateMesh:
                        string dir =  Directory.GetCurrentDirectory();
                        string name = System.Text.Encoding.UTF8.GetString(e.RawData, 1, e.RawData.Length - 1);
                        string filename = Path.Combine(dir, "mesh", name);
                        singleton.CreateMesh(filename, KinectV2NodeWrapper.Support.MeshFormat.Ply);
                        e.RawData[0] = CreateMeshCompleted;
                        Send(CommunicationUtils.Compress(e.RawData, e.RawData.Length));
                        break;
                }
            }
        }

        protected override void OnClose(CloseEventArgs e)
        {
            base.OnClose(e);
            CloseKinect();
            
        }

        protected override void OnError(WebSocketSharp.ErrorEventArgs e)
        {
            base.OnError(e);
            CloseKinect();

        }

        private void CloseKinect()
        {
            KinectFusionWrapper singleton = KinectFusionWrapper.GetInstance();
            singleton.OnReconstructionFrame -= Singleton_OnReconstructionFrame;
            Console.WriteLine("KinectFusion Stopped");
        }


    }
}
