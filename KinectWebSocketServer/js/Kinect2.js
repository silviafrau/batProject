(function (kinect2, undefined) {
    var _nBody = 6;
    var _nJoints = 25;
    var _jointSize = 24;
    var _bodyHeader = 24;
    var _orientationSize = 20;
    var _size = _bodyHeader + _nJoints * (_jointSize + _orientationSize);
    var msgType = {
        bodyFrame: 1,
        colorFrame: 2,
        receiveBodyFrames: 3,
        receiveColorFrames: 4,
        depthFrame: 5,
        receiveDepthFrames: 6
    };

    var _frameEdges = {
        none: 0,
        right: 1,
        left: 2,
        top: 4,
        bottom: 8
    };
    kinect2.FrameEdges = _frameEdges;

    var _trackingConfidence = {
        high: 1,
        low: 0
    }
    kinect2.TrackingConfidence = _trackingConfidence;

    var _handState = {
        unknown: 0,
        notTracked: 1,
        open: 2,
        closed: 3,
        lasso: 4
    };
    kinect2.HandState = _handState;

    var _trackingState = {
        notTracked: 0,
        inferred: 1,
        tracked: 2
    }
    kinect2.TrackingState = _trackingState;

    var _jointType = {
        SpineBase: 0,
        SpineMid: 1,
        Neck: 2,
        Head: 3,
        ShoulderLeft: 4,
        ElbowLeft: 5,
        WristLeft: 6,
        HandLeft: 7,
        ShoulderRight: 8,
        ElbowRight: 9,
        WristRight: 10,
        HandRight: 11,
        HipLeft: 12,
        KneeLeft: 13,
        AnkleLeft: 14,
        FootLeft: 15,
        HipRight: 16,
        KneeRight: 17,
        AnkleRight: 18,
        FootRight: 19,
        SpineShoulder: 20,
        HandTipLeft: 21,
        ThumbLeft: 22,
        HandTipRight: 23,
        ThumbRight: 24,
    };
    kinect2.JointType = _jointType;

    var _boneHierarchy = {
        jointType: kinect2.JointType.SpineBase,
        parent: null,
        children: [
            {
                // right leg
                jointType: kinect2.JointType.HipRight,
                parent: kinect2.JointType.SpineBase,
                children: [
                    {
                        jointType: kinect2.JointType.KneeRight,
                        parent: kinect2.JointType.HipRight,
                        children: [
                            {
                                jointType: kinect2.JointType.AnkleRight,
                                parent: kinect2.JointType.KneeRight,
                                children: [
                                    {
                                        jointType: kinect2.JointType.FootRight,
                                        parent: kinect2.JointType.AnkleRight,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                // left leg
                jointType: kinect2.JointType.HipLeft,
                parent: kinect2.JointType.SpineBase,
                children: [
                    {
                        jointType: kinect2.JointType.KneeLeft,
                        parent: kinect2.JointType.HipLeft,
                        children: [
                            {
                                jointType: kinect2.JointType.AnkleLeft,
                                parent: kinect2.JointType.KneeLeft,
                                children: [
                                    {
                                        jointType: kinect2.JointType.FootLeft,
                                        parent: kinect2.JointType.AnkleLeft,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                jointType: kinect2.JointType.SpineMid,
                parent: kinect2.JointType.SpineBase,
                children: [
                    {
                        jointType: kinect2.JointType.SpineShoulder,
                        parent: kinect2.JointType.SpineMid,
                        children: [
                            // head
                            {
                                
                                jointType: kinect2.JointType.Neck,
                                parent: kinect2.JointType.SpineShoulder,
                                children: [
                                    {
                                        jointType: kinect2.JointType.Head,
                                        parent: kinect2.JointType.Neck,
                                        children: []
                                    }
                                ]
                            },

                            // right arm
                            {
                                jointType: kinect2.JointType.ShoulderRight,
                                parent: kinect2.JointType.SpineMid,
                                children: [
                                    {
                                        jointType: kinect2.JointType.ElbowRight,
                                        parent: kinect2.JointType.ShoulderRight,
                                        children: [
                                            {
                                                jointType: kinect2.JointType.WristRight,
                                                parent: kinect2.JointType.ElbowRight,
                                                children: [
                                                    {
                                                        jointType: kinect2.JointType.HandRight,
                                                        parent: kinect2.JointType.WristRight,
                                                        children: [
                                                            {
                                                                jointType: kinect2.JointType.HandTipRight,
                                                                parent: kinect2.JointType.HandRight,
                                                                children: []
                                                            }
                                                        ]
                                                    },

                                                    {
                                                        jointType: kinect2.JointType.ThumbRight,
                                                        parent: kinect2.JointType.WristRight,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },

                            // left arm
                            {
                                jointType: kinect2.JointType.ShoulderLeft,
                                parent: kinect2.JointType.SpineMid,
                                children: [
                                    {
                                        jointType: kinect2.JointType.ElbowLeft,
                                        parent: kinect2.JointType.ShoulderLeft,
                                        children: [
                                            {
                                                jointType: kinect2.JointType.WristLeft,
                                                parent: kinect2.JointType.ElbowLeft,
                                                children: [
                                                    {
                                                        jointType: kinect2.JointType.HandLeft,
                                                        parent: kinect2.JointType.WristLeft,
                                                        children: [
                                                            {
                                                                jointType: kinect2.JointType.HandTipLeft,
                                                                parent: kinect2.JointType.HandLeft,
                                                                children: []
                                                            }
                                                        ]
                                                    },

                                                    {
                                                        jointType: kinect2.JointType.ThumbLeft,
                                                        parent: kinect2.JointType.WristLeft,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    kinect2.boneHierarchy = _boneHierarchy;

    var _joint = function () {
        this.init = function () {
            this.jointType = kinect2.JointType.SpineBase;
            this.position = {
                x: 0.0,
                y: 0.0,
                z: 0.0
            };
            this.trackingState = kinect2.TrackingState.notTracked;
            this.rgbPosition = {
                x: 0.0,
                y: 0.0
            };
        }

        this.init();
    }
    kinect2.Joint = _joint;

    var _jointOrientation = function () {
        this.init = function () {
            this.jointType = kinect2.JointType.SpineBase;
            this.orientation = {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 0.0
            }
        }

        this.init();
    }
    kinect2.JointOrientation = _jointOrientation;

    var _body = function () {

        this.init = function () {
            this.clippedEdges = kinect2.FrameEdges.none;
            this.handLeftConfidence = kinect2.TrackingConfidence.low;
            this.handRightConfidence = kinect2.TrackingConfidence.low;
            this.handLeftState = kinect2.HandState.unknown;
            this.handRightState = kinect2.HandState.unknown;
            this.isRestriced = false;
            this.isTracked = false;
            this.leanTrackingState = kinect2.TrackingState.notTracked;
            this.trackingId = "-1";
            this.lean = {
                x: 0.0,
                y: 0.0
            };
            this.joints = new Array(_nJoints);
            this.jointOrientation = new Array(_nJoints);
            for (var i = 0; i < _nJoints; i++) {
                this.joints[i] = new kinect2.Joint();
                this.joints[i].jointType = i;
            }

            for (var i = 0; i < _nJoints; i++) {
                this.jointOrientation[i] = new kinect2.JointOrientation();
                this.jointOrientation[i].jointType = i;
            }
        };


        this.init();
    }
    kinect2.Body = _body;

   
    var _sensor = function () {
        var _self = this;
        var rgbImage;
        var depthImage;
        // the websocket server
        var ws;
        // the websocket url
        //this.webSocketUrl = "ws://192.168.1.134:8787/Kinect2/Kinect"
        this.webSocketUrl = "ws://127.0.0.1:8787/Kinect2/Kinect";
		var _bodyBuffer = [];
        this.init = function () {
            for (i = 0; i < _nBody; i++) {
                _bodyBuffer[i] = new kinect2.Body();
            }
        }

        this.onBodyFrame = function (bodyArray) {

        };

       
        this.setRgbImage = function (img){
            rgbImage = img;
        }

        this.setDepthImage = function (img) {
            depthImage = img;
        }

        this.receiveBodyFrames = function (val) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.receiveBodyFrames;
                msg[1] = val ? 1 : 0;
                ws.send(msg);
            }
        }

        this.receiveColorFrames = function (val) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.receiveColorFrames;
                msg[1] = val ? 1 : 0;
                ws.send(msg);
            }
        }

        this.receiveDepthFrames = function (val) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.receiveDepthFrames;
                msg[1] = val ? 1 : 0;
                ws.send(msg);
            }
        }

        //var parser = new JpegDecoder();
        var frameCount = 0;
        this.open = function (callback) {
            ws = new WebSocket(this.webSocketUrl);
            ws.onopen = function (event) {
                callback();
            };

            ws.binaryType = "arraybuffer"
            

            var now = new Date().getTime();
            var synchDelta = 2000;

            ws.onmessage = function (event) {
                var payload = new Uint8Array(event.data);
                // the first integer represents the message type
                switch (payload[0]) {

                    // new frame for the scene reconstruction
                    case msgType.bodyFrame:
                        var bodyArray = [];
                        var n = (payload.length - 4) / _size;
                        for (var i = 0; i < n; i++) {
                            var bytePayload = new Uint8Array(event.data, 4 + i * _size, _size)
                            _bodyBuffer[i].clippedEdges = bytePayload[0];
                            _bodyBuffer[i].handLeftConfidence = bytePayload[1];
                            _bodyBuffer[i].handRightConfidence = bytePayload[2];
                            _bodyBuffer[i].handLeftState = bytePayload[3];
                            _bodyBuffer[i].handRightState = bytePayload[4];
                            _bodyBuffer[i].isRestriced = bytePayload[5] == 1 ? true : false;
                            _bodyBuffer[i].isTracked = bytePayload[6] == 1 ? true : false;
                            _bodyBuffer[i].leanTrackingState = bytePayload[7];

                            var id = new bigInt();
                            for (var j = 0; j < 8; j++) {
                                id = id.shiftLeft(8).add(bytePayload[15 - j]);
                            }
                            _bodyBuffer[i].trackingId = id.toString();
                            bodyArray[_bodyBuffer[i].trackingId] = _bodyBuffer[i];

                            var floatPayload = new Float32Array(event.data, 20 + i * _size, 3);
                            _bodyBuffer[i].lean.x = floatPayload[0];
                            _bodyBuffer[i].lean.y = floatPayload[1];

                            var offset = _bodyHeader;
                            for (j = 0; j < _nJoints; j++) {
                                var joint = _bodyBuffer[i].joints[bytePayload[offset]];
                                joint.jointType = bytePayload[offset],
                                joint.trackingState = bytePayload[offset + 1];
                                floatPayload = new Float32Array(event.data, 8 + offset + i * _size, 5);
                                joint.position.x = floatPayload[0];
                                joint.position.y = floatPayload[1];
                                joint.position.z = floatPayload[2];
                                joint.rgbPosition.x = floatPayload[3];
                                joint.rgbPosition.y = floatPayload[4];
                                offset += _jointSize;
                            }



                            for (j = 0; j < _nJoints; j++) {
                                var orientation = _bodyBuffer[i].jointOrientation[bytePayload[offset]];
                                orientation.jointType = bytePayload[offset];
                                floatPayload = new Float32Array(event.data, 8 + offset + i * _size, 4);
                                orientation.orientation.x = floatPayload[0];
                                orientation.orientation.y = floatPayload[1];
                                orientation.orientation.z = floatPayload[2];
                                orientation.orientation.w = floatPayload[3];
                                offset += _orientationSize;
                            }

                            //console.log(_bodyBuffer[i].joints[kinect2.JointType.Head].position.x);
                            //console.log(_bodyBuffer[i].jointOrientation[kinect2.JointType.ShoulderLeft].orientation.x);
                            //console.log(_bodyBuffer[i].lean.x);
                        }
                        _self.onBodyFrame(bodyArray);
                        break;

                    case msgType.colorFrame:
                        var time = new Uint32Array(event.data, 4, 1)[0];
                        now = (new Date()).getTime() % 600000;
                        //console.log(now + ":" + time);
                        if (now - time < synchDelta) {
                            var start = new Date().getTime();
                            var encoded = new Uint8Array(event.data, 8, event.data.byteLength - 8);
                            var s = "";
                            for (var i = 0; i < encoded.length; i++)
                                s += String.fromCharCode(encoded[i]);
                            rgbImage.setAttribute('src', s);
                        } else {
                            console.log("skipped rgb frame");
                        }
                        elapsed = (new Date().getTime()) - now;
                        break;

                    case msgType.depthFrame:
                        var time = new Uint32Array(event.data, 4, 1)[0];
                        now = (new Date()).getTime()  % 600000;
                        //console.log(now + ":" + time);
                        if (now - time < synchDelta) {
                            var start = new Date().getTime();
                            var encoded = new Uint8Array(event.data, 8, event.data.byteLength - 8);
                            var s = "";
                            for (var i = 0; i < encoded.length; i++)
                                s += String.fromCharCode(encoded[i]);
                            depthImage.setAttribute('src', s);
                        } else {
                            console.log("skipped depth frame");
                        }
                        elapsed = (new Date().getTime()) - now;
                        break;
                }
            }
        }
        this.init();
    }
    kinect2.Sensor = _sensor;



}(window.kinect2 = window.kinect2 || {}, undefined));