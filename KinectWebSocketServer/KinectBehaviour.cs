using System;
using WebSocketSharp.Server;
using KinectV2NodeWrapper;
using WebSocketSharp;
using System.IO;
using System.Drawing;
using System.IO.Compression;
using KinectV2NodeWrapper.SkeletonSerialization;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace KinectWebSocketServer
{

    class KinectBehaviour : WebSocketBehavior
    {
        const byte BodyFrame = 1;
        const byte ColorFrame = 2;
        const byte ReceiveBodyFrames = 3;
        const byte ReceiveColorFrames = 4;
        const byte DepthFrame = 5;
        const byte ReceiveDepthFrames = 6;

        byte[] buffer = null;
        MemoryStream m;
        StreamWriter sw;
        Bitmap rgb = new Bitmap(1920, 1080, PixelFormat.Format32bppArgb);
        Bitmap depth = new Bitmap(512, 424, PixelFormat.Format32bppRgb);
        DateTime start = DateTime.Now;

        protected override void OnOpen()
        {
            base.OnOpen();
            buffer = new byte[10 * 1024 * 1024];
            m = new MemoryStream(buffer, sizeof(int), buffer.Length - sizeof(int));
            sw = new StreamWriter(m,System.Text.Encoding.ASCII);
            KinectWrapper singleton = KinectWrapper.GetInstance();
            singleton.OnBodyFrame += Singleton_OnBodyFrame;
            singleton.OnColorFrame += Singleton_OnColorFrame;
            singleton.OnDepthFrame += Singleton_OnDepthFrame;
            Console.WriteLine("Kinect Started");
            
        }

        private void Singleton_OnDepthFrame(ref ushort[] frame)
        {
            if (!KinectWrapper.GetInstance().ReceiveDepthFrames)
            {
                return;
            }

            int x = 0, y = 0;
            int width = depth.Size.Width;
            int val = 0;

            for (int j = 0; j < frame.Length; j++)
            {
                x = j % width;
                y = j / width;
                val = Math.Min(255, Math.Max(0, (int)(((1.0 * frame[j] - 500) / 4500) * 256)));
                depth.SetPixel(x, y, Color.FromArgb(val, val, val));
            }

            buffer[0] = DepthFrame;
            
            m.Position = 0;
            depth.Save(m, ImageFormat.Png);
            String s = "data:image/png;base64," + System.Convert.ToBase64String(buffer, 4, (int)m.Position);
            m.Position = 0;
            int millis = (int)(((DateTime.UtcNow.Ticks /10000)  % 600000));
            m.Write(BitConverter.GetBytes(millis), 0, 4);
            sw.Write(s);
            sw.Flush();
           
            Console.WriteLine(millis);
            this.Send(buffer, (int)(m.Position + sizeof(int)));
            m.Position = 0;
            start = DateTime.Now;
        }

        private void Singleton_OnColorFrame(ref byte[] frame)
        {
            if (!KinectWrapper.GetInstance().ReceiveColorFrames)
            {
                return;
            }
            
            byte red, green, blue;
            for (int j = 0; j < frame.Length; j += 4)
            {
               

                red = frame[j + 2];
                green = frame[j + 1];
                blue = frame[j];
                frame[j] = red;
                frame[j + 1] = green;
                frame[j + 2] = blue;           
               
            }


            //Buffer.BlockCopy(frame, 0, buffer, 4, frame.Length);
            buffer[0] = ColorFrame;
            BitmapData bmpData = rgb.LockBits(
                       new Rectangle(0, 0, rgb.Width, rgb.Height),
                       ImageLockMode.WriteOnly, rgb.PixelFormat);

            //Copy the data from the byte array into BitmapData.Scan0
            Marshal.Copy(frame, 0, bmpData.Scan0, frame.Length);


            //Unlock the pixels
            rgb.UnlockBits(bmpData);

            m.Position = 0;
            rgb.Save(m, ImageFormat.Jpeg);
            String s = "data:image/jpg;base64,"+ System.Convert.ToBase64String(buffer, 4, (int) m.Position);
            m.Position = 0;

            int millis = (int)(((DateTime.UtcNow.Ticks / 10000) % 600000));
            m.Write(BitConverter.GetBytes(millis), 0, 4);
            sw.Write(s);
            sw.Flush();
            this.Send(buffer, (int)(m.Position + sizeof(int)));
            m.Position = 0;
            start = DateTime.Now;
        }

        private void Singleton_OnBodyFrame(BodyFrameSerializer serializer)
        {
            if (!KinectWrapper.GetInstance().ReceiveBodyFrames)
            {
                return;
            }
            Buffer.BlockCopy(serializer.GetData(), 0, buffer, 4, serializer.GetDataLength());
                buffer[0] = BodyFrame;
                this.Send(buffer, 4 + serializer.GetDataLength());
           
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            base.OnMessage(e);
            KinectWrapper singleton = KinectWrapper.GetInstance();
            if (e.IsBinary)
            {
                switch (e.RawData[0])
                {
                    case ReceiveBodyFrames:
                        singleton.ReceiveBodyFrames = e.RawData[1] == 1;
                        break;

                    case ReceiveColorFrames:
                        singleton.ReceiveColorFrames = e.RawData[1] == 1;
                        break;
                    case ReceiveDepthFrames:
                        singleton.ReceiveDepthFrames = e.RawData[1] == 1;
                        break;
                    default: break;
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
            KinectWrapper singleton = KinectWrapper.GetInstance();
            singleton.OnBodyFrame -= Singleton_OnBodyFrame;
            singleton.OnColorFrame -= Singleton_OnColorFrame;
            singleton.OnDepthFrame -= Singleton_OnDepthFrame;
            Console.WriteLine("Kinect Stopped");
        }


    }
}
