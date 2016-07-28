namespace KinectV2NodeWrapper.Support
{
    using System;
    using System.Collections.Generic;
    using Microsoft.Kinect;
    using System.Windows.Media.Media3D;
    using System.Windows.Media;

    public class Body3D
    {
        private int Id { get; set; }

        //private Dictionary<JointType, ModelVisual3D> joints;

        private Dictionary<JointType, CircularBuffer<Point3D>> jointCloud;

        public static Dictionary<JointType, Color> CloudColor = new Dictionary<JointType, Color>
        {
            // Spine and Head
            { JointType.Head, Colors.MidnightBlue},
            { JointType.Neck, Colors.CornflowerBlue },
            { JointType.SpineShoulder, Colors.Navy},
            { JointType.SpineMid, Colors.LightSteelBlue},
            { JointType.SpineBase, Colors.MediumBlue },

            // Right Arm
            { JointType.ShoulderRight, Colors.GreenYellow},
            { JointType.ElbowRight, Colors.LimeGreen},
            { JointType.WristRight, Colors.MediumSpringGreen},
            { JointType.HandRight, Colors.ForestGreen},
            { JointType.ThumbRight, Colors.OliveDrab},
            { JointType.HandTipRight, Colors.SeaGreen},

            // Left Arm
            { JointType.ShoulderLeft, Colors.Thistle},
            { JointType.ElbowLeft, Colors.Fuchsia},
            { JointType.WristLeft, Colors.MediumOrchid},
            { JointType.HandLeft, Colors.DarkMagenta},
            { JointType.ThumbLeft, Colors.MediumSlateBlue},
            { JointType.HandTipLeft, Colors.Indigo},

            //Right Leg
            { JointType.HipRight, Colors.Salmon},
            { JointType.KneeRight, Colors.LightCoral},
            { JointType.AnkleRight, Colors.Crimson},
            { JointType.FootRight, Colors.Firebrick},

            // Left Leg
            { JointType.HipLeft, Colors.Gold},
            { JointType.KneeLeft, Colors.Yellow},
            { JointType.AnkleLeft, Colors.Moccasin},
            { JointType.FootLeft, Colors.DarkKhaki}
        };

       /* public Dictionary<JointType, ModelVisual3D> Joints
        {
            get { return joints; }
        }*/

        public Dictionary<JointType, CircularBuffer<Point3D>> JointCloud
        {
            get { return jointCloud; }
        }


        public Body3D()
        {
            EmissiveMaterial material = new EmissiveMaterial(new SolidColorBrush(Colors.Red));

            //joints = new Dictionary<JointType, ModelVisual3D>();
            jointCloud = new Dictionary<JointType, CircularBuffer<Point3D>>();
            foreach (JointType jointType in Enum.GetValues(typeof(JointType)))
            {
                /*SphereGeometry3D sphereGeometry = new SphereGeometry3D();
                sphereGeometry.Radius = 0.01;
                sphereGeometry.Separators = 5;

                MeshGeometry3D mesh = new MeshGeometry3D();
                mesh.Positions = sphereGeometry.Points;
                mesh.TriangleIndices = sphereGeometry.TriangleIndices;
                GeometryModel3D model = new GeometryModel3D(mesh, material);

                ModelVisual3D visual = new ModelVisual3D();
                visual.Content = model;
                joints[jointType] = visual;*/
                jointCloud[jointType] = new CircularBuffer<Point3D>(500);
            }
        }

        public void ClearClouds()
        {
            foreach (JointType jointType in Enum.GetValues(typeof(JointType)))
            {
                jointCloud[jointType].Clear();
            }
        }
    }
}


