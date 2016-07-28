using System;
using Microsoft.Kinect;
using System.IO;
using System.Collections.Generic;

namespace KinectV2NodeWrapper.SkeletonSerialization
{
    public class BodySerializer
    {
        private static int JointCount = Enum.GetNames(typeof(JointType)).Length;
        private BinaryWriter writer = null;
        private CoordinateMapper mapper;
        private ColorSpacePoint rgbPoint;
        public BodySerializer()
        {
            MemoryStream buffer = new MemoryStream(GetSerializedInstanceSize());
            writer = new BinaryWriter(buffer);
            mapper = KinectSensor.GetDefault().CoordinateMapper;
        }

        public BodySerializer(byte[] buffer, int start)
        {
            MemoryStream _buffer = new MemoryStream(buffer, start, GetSerializedInstanceSize(), true, true);
            writer = new BinaryWriter(_buffer);
        }

        public static int GetSerializedInstanceSize()
        {
            return
                // body data
                (8 * sizeof(byte) +
                sizeof(ulong) + 2 * sizeof(float)) +

                //joint data
                JointCount * (4 * sizeof(byte) +
                5 * sizeof(float)) +

                // joint orientation data
                JointCount * (4 * sizeof(byte) +
                4 * sizeof(float));
        }

        public void Read(Body body)
        {
            mapper = KinectSensor.GetDefault().CoordinateMapper;
            writer.Seek(0, SeekOrigin.Begin);

            writer.Write((byte)body.ClippedEdges);
            writer.Write((byte)body.HandLeftConfidence);
            writer.Write((byte)body.HandRightConfidence);
            writer.Write((byte)body.HandLeftState);
            writer.Write((byte)body.HandRightState);
            writer.Write(body.IsRestricted ? (byte) 1 : (byte) 0);
            writer.Write(body.IsTracked ? (byte)1 : (byte)0);
            writer.Write((byte)body.LeanTrackingState);
            writer.Write(body.TrackingId);

            writer.Write(body.Lean.X);
            writer.Write(body.Lean.Y);
            
           
            // serialize Joints
            IReadOnlyDictionary<JointType, Joint> joints = body.Joints;
            foreach (JointType jointType in joints.Keys)
            {
                this.SerializeJoint(body.Joints[jointType]);
            }

            // serialize Joint Orientations
            foreach (JointType jointType in joints.Keys)
            {
                this.SerializeJointOrientation(body.JointOrientations[jointType]);
            }

            //Console.WriteLine(body.Joints[JointType.Head].Position.X);
            //Console.WriteLine(body.JointOrientations[JointType.ShoulderLeft].Orientation.X);
            //Console.WriteLine(body.Lean.X);
            writer.Flush();
           
        }

        private void SerializeJoint(Joint j)
        {
            writer.Write((byte)j.JointType);
            writer.Write((byte)j.TrackingState);

            // two padding bytes
            writer.Write((byte) 0);
            writer.Write((byte) 0);

            // three floats
            writer.Write(j.Position.X);
            writer.Write(j.Position.Y);
            writer.Write(j.Position.Z);
            // joint position in the RGB camera space
            rgbPoint = mapper.MapCameraPointToColorSpace(j.Position);
            writer.Write(rgbPoint.X);
            writer.Write(rgbPoint.Y);

        }

        private void SerializeJointOrientation(JointOrientation j)
        {
            writer.Write((byte)j.JointType);
            // three padding bytes
            writer.Write((byte)0);
            writer.Write((byte)0);
            writer.Write((byte)0);

            // four floats
            writer.Write(j.Orientation.X);
            writer.Write(j.Orientation.Y);
            writer.Write(j.Orientation.Z);
            writer.Write(j.Orientation.W);
        }

       
    }
}
