using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinectWebSocketServer
{
    public class CommunicationUtils
    {

        public static byte[] Compress(byte[] raw, int length)
        {
            using (MemoryStream memory = new MemoryStream())
            {
                using (GZipStream gzip = new GZipStream(memory,
                CompressionMode.Compress, true))
                {
                    gzip.Write(raw, 0, length);
                }
                return memory.ToArray();
            }
        }
    }
}
