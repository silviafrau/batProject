using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;
using KinectV2NodeWrapper.SkeletonSerialization;

namespace KinectV2NodeWrapper
{

    public class KinectWrapper
    {
        private static KinectWrapper singleton;

        public delegate void BodyFrameSerializerDelegate(BodyFrameSerializer serializer);
        public delegate void ColorFrameDelegate(ref byte[] frame);
        public delegate void DepthFrameDelegate(ref ushort[] frame);

        private Body[] bodies = null;
        private BodyFrameSerializer serializer;
        private byte[] colorFrameBuffer = null;
        private ushort[] depthFrameBuffer = null;

        public bool ReceiveBodyFrames { get; set; }
        public bool ReceiveColorFrames { get; set; }
        public bool ReceiveDepthFrames { get; set; }

        public event BodyFrameSerializerDelegate OnBodyFrame;
        public event ColorFrameDelegate OnColorFrame;
        public event DepthFrameDelegate OnDepthFrame;

        /// <summary>
        /// Lock object for raw pixel access
        /// </summary>
        private object rawDataLock = new object();


        public static KinectWrapper GetInstance()
        {
            if (singleton == null)
            {
                singleton = new KinectWrapper();
            }

            return singleton;
        }

        private KinectWrapper()
        {
            KinectManager sensor = KinectManager.GetInstance();
            if (null == sensor)
            {
                Console.WriteLine("No Kinect sensor ready");
                return;
            }
            this.serializer = new BodyFrameSerializer();

            this.ReceiveBodyFrames = false;
            this.ReceiveColorFrames = false;

            sensor.GetMultiSourceFrameReader().MultiSourceFrameArrived += KinectWrapper_MultiSourceFrameArrived;
        }

        private void KinectWrapper_MultiSourceFrameArrived(object sender, MultiSourceFrameArrivedEventArgs e)
        {
            MultiSourceFrameReference frameReference = e.FrameReference;

            MultiSourceFrame multiSourceFrame = null;
            DepthFrame depthFrame = null;
            ColorFrame colorFrame = null;
            BodyFrame bodyFrame = null;

            try
            {
                multiSourceFrame = frameReference.AcquireFrame();

                if (multiSourceFrame != null)
                {
                    // MultiSourceFrame is IDisposable
                    lock (this.rawDataLock)
                    {
                        
                        if (ReceiveBodyFrames)
                        {
                            BodyFrameReference bodyFrameReference = multiSourceFrame.BodyFrameReference;
                            bodyFrame = bodyFrameReference.AcquireFrame();

                            if (bodyFrame != null)
                            {
                                if (this.bodies == null)
                                {
                                    this.bodies = new Body[bodyFrame.BodyCount];
                                }

                                bodyFrame.GetAndRefreshBodyData(this.bodies);
                                serializer.Read(bodies);

                                if (this.OnBodyFrame != null)
                                {
                                    this.OnBodyFrame(serializer);
                                }
                            }

                        }
                       

                        if (ReceiveColorFrames)
                        {
                            ColorFrameReference colorFrameReference = multiSourceFrame.ColorFrameReference;
                            colorFrame = colorFrameReference.AcquireFrame();
                            if (colorFrame != null)
                            {
                                if (colorFrameBuffer == null)
                                {
                                    colorFrameBuffer = new byte[4 * colorFrame.FrameDescription.LengthInPixels];
                                }

                                colorFrame.CopyConvertedFrameDataToArray(colorFrameBuffer, ColorImageFormat.Rgba);

                                if (this.OnColorFrame != null)
                                {
                                    this.OnColorFrame(ref colorFrameBuffer);
                                }
                            }
                        }

                        if (ReceiveDepthFrames)
                        {
                            DepthFrameReference depthFrameReference = multiSourceFrame.DepthFrameReference;
                            depthFrame = depthFrameReference.AcquireFrame();

                            if (depthFrame != null)
                            {
                                if(depthFrameBuffer == null)
                                {
                                    depthFrameBuffer = new ushort[depthFrame.FrameDescription.LengthInPixels];
                                }
                            
                                depthFrame.CopyFrameDataToArray(depthFrameBuffer);
                                if (this.OnDepthFrame != null)
                                {
                                    this.OnDepthFrame(ref depthFrameBuffer);
                                }
                            }
                        }
                        
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                // MultiSourceFrame, DepthFrame, ColorFrame, BodyIndexFrame are IDispoable
                if (depthFrame != null)
                {
                    depthFrame.Dispose();
                    depthFrame = null;
                }

                if (colorFrame != null)
                {
                    colorFrame.Dispose();
                    colorFrame = null;
                }

                if(bodyFrame != null)
                {
                    bodyFrame.Dispose();
                    bodyFrame = null;
                }

                if (multiSourceFrame != null)
                {
                    multiSourceFrame = null;
                }
            }
        }


    }
}
