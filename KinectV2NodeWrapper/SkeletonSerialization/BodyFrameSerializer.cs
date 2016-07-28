using System;
using Microsoft.Kinect;

namespace KinectV2NodeWrapper.SkeletonSerialization
{
    public class BodyFrameSerializer
    {
        private const int NBODY = 6;
        private byte[] buffer = null;
        private BodySerializer[] bodySerializers = null;
        private int bodyCount = -1;

        public BodyFrameSerializer()
        {
            //Console.WriteLine("Body data size: " + BodySerializer.GetSerializedInstanceSize());
            buffer = new byte[GetSerializedInstanceSize()];
            bodySerializers = new BodySerializer[NBODY];
            for(int i = 0; i< NBODY; i++)
            {
                bodySerializers[i] = new BodySerializer(
                    buffer, i * BodySerializer.GetSerializedInstanceSize());
            }
        }

        public static int GetSerializedInstanceSize()
        {
            return NBODY * BodySerializer.GetSerializedInstanceSize();
        }

        public void Read(Body[] bodies)
        {
           bodyCount = 0;
           for(int i = 0; i < bodies.Length && i < NBODY; i++)
            {
                if (bodies[i].IsTracked)
                {
                    bodySerializers[bodyCount].Read(bodies[i]);
                    bodyCount++;
                }
               
            }
        }

        public byte[] GetData()
        {
            return buffer;
        }

        public int GetDataLength()
        {
            if(bodyCount < 0)
            {
                return 0;
            }
            else
            {
                return bodyCount * BodySerializer.GetSerializedInstanceSize();
            }
        }
    }
}
