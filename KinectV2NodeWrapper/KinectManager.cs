using System;
using Microsoft.Kinect;
namespace KinectV2NodeWrapper
{

    class KinectManager : IDisposable
    {
        private KinectSensor sensor;
        private MultiSourceFrameReader reader;
        private static KinectManager singleton;

        public static KinectManager GetInstance()
        {
            if(singleton == null)
            {
                singleton = new KinectManager();
            }

            return singleton;
        }


        private KinectManager()
        {
            this.sensor = KinectSensor.GetDefault();
            this.sensor.Open();
            this.reader = this.sensor.OpenMultiSourceFrameReader(FrameSourceTypes.Depth | FrameSourceTypes.Color | FrameSourceTypes.Body);
            //this.reader = this.sensor.OpenMultiSourceFrameReader(FrameSourceTypes.Depth | FrameSourceTypes.Body);
        }

        public MultiSourceFrameReader GetMultiSourceFrameReader()
        {
            return reader;
        }

        public CoordinateMapper GetCoordinateMapper()
        {
            return this.sensor.CoordinateMapper;
        }

        public DepthFrameSource GetDepthFrameSource()
        {
            return this.sensor.DepthFrameSource;
        }

        public ColorFrameSource GetColorFrameSource()
        {
            return this.sensor.ColorFrameSource;
        }

        //Implement IDisposable.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                sensor.Close();
                sensor = null;
                reader = null;
            }
           
        }

        ~KinectManager()
        {
            Dispose(false);
        }

    }
}
