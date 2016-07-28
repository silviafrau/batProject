using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KinectV2NodeWrapper;

namespace KinectFusionWrapperTest
{
    class Program
    {
        static void Main(string[] args)
        {
            KinectFusionWrapper wrapper = KinectFusionWrapper.GetInstance();
            wrapper.CaptureColor = true;
            wrapper.Start();
            Console.ReadKey();
            wrapper.SaveBitmap(@"C:\Users\Davide\kinectDepth.png");
            wrapper.Stop();
        }
    }
}
