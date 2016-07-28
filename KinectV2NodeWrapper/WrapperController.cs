//#r "..\KinectV2NodeWrapper\obj\Debug\KinectV2NodeWrapper.dll"
//#r "..\KinectV2NodeWrapper\bin\Debug\Microsoft.Kinect.Fusion.dll"

using KinectV2NodeWrapper;
using System.Threading.Tasks;

public class Startup
{
    public async Task<object> Invoke(string command)
    {
        return  ".NET welcomes " + Class1.HelloWorld();
    }
} 

