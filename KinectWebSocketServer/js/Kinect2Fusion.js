(function (kinect2Fusion, undefined) {
    var msgType = {
        reconstructionImage : 1,
        colorTexture: 2,
        normalTexture: 3,
        volumeTexture: 4,
        pauseIntegration: 5,
        resetReconstruction: 6,
        findCameraPose: 7,
        kinectView: 8,
        mirrorDepth: 9,
        depthRange: 10,
        integrationWeight: 11,
        voxelPerMeter: 12,
        voxelsX: 13,
        voxelsY: 14,
        voxelsZ: 15,
        resetCamera: 16,
        createMesh: 17,
        createMeshComplete: 18
    }

    var _kinect2Fusion = function() {
        this.init = function () {

        }

        // the reconstruction image data (3d model display)
        var reconstructionImage;
        // the reconstruction canvas graphics context (3d model display)
        var reconstructionContext;
        // the websocket server
        var ws;

        // the reconstruction image width
        this.reconstructionWidth = 512;
        // the reconstruction image height
        this.reconstructionHeight = 424;

        // the websocket url
        //this.webSocketUrl = "ws://192.168.1.134:8787/Kinect2/KinectFusion"
        this.webSocketUrl = "ws://127.0.0.1:8787/Kinect2/KinectFusion"
        var _self = this;
        this.setReconstructionCanvas = function (canvas){
            reconstructionContext = canvas.getContext('2d');
            reconstructionImage = reconstructionContext.getImageData(
                0, 0, this.reconstructionWidth, this.reconstructionHeight);
        }

        this.colorTexture = function () {
            if (ws) {
                var msg = new Uint8Array(1);
                msg[0] = msgType.colorTexture;
                ws.send(msg);
            }
        }

        this.normalsTexture = function () {
            if (ws) {
                var msg = new Uint8Array(1);
                msg[0] = msgType.normalTexture;
                ws.send(msg);
            }
        }

        this.volumeTexture = function () {
            if (ws) {
                var msg = new Uint8Array(1);
                msg[0] = msgType.volumeTexture;
                ws.send(msg);
            }
        }

        this.pauseIntegration = function (pause) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.pauseIntegration;
                msg[1] = pause ? 1 : 0;
                ws.send(msg);
            }
        }

        this.resetReconstruction = function () {
            if (ws) {
                var msg = new Uint8Array(1);
                msg[0] = msgType.resetReconstruction;
                ws.send(msg);
            }
        }

        this.findCameraPose = function (find) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.findCameraPose;
                msg[1] = find ? 1 : 0;
                ws.send(msg);
            }
        }

        this.kinectView = function (view) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.kinectView;
                msg[1] = view ? 1 : 0;
                ws.send(msg);
            }
        }

        this.mirrorDepth = function (mirror) {
            if (ws) {
                var msg = new Uint8Array(2);
                msg[0] = msgType.mirrorDepth;
                msg[1] = mirror ? 1 : 0;
                ws.send(msg);
            }
        }

        this.depthRange = function (min, max) {
            if (ws) {
                var msg = new ArrayBuffer(24);
                var msgByte = new Uint8Array(msg);
                msgByte[0] = msgType.depthRange;
                var msgDouble = new Float64Array(msg, 8, 2);
                msgDouble[0] = min;
                msgDouble[1] = max;
                ws.send(msg);
            }
        }

        this.integrationWeight = function (val){
            if (ws) {
                var msg = new ArrayBuffer(10);
                var msgByte = new Uint8Array(msg);
                msgByte[0] = msgType.integrationWeight;
                var msgInt = new Uint32Array(msg, 8, 1);
                msgInt[0] = val;
                ws.send(msg);
            }
        }

        this.voxelPerMeter = function (val) {
            if (ws) {
                var msg = new ArrayBuffer(10);
                var msgByte = new Uint8Array(msg);
                msgByte[0] = msgType.voxelPerMeter;
                var msgInt = new Uint16Array(msg, 8, 1);
                msgInt[0] = val;
                ws.send(msg);
            }
        }

        this.voxels = function (axis, val) {
            if (ws) {
                var msg = new ArrayBuffer(10);
                var msgByte = new Uint8Array(msg);
                switch (axis) {
                    case "x":
                        msgByte[0] = msgType.voxelsX;
                        break;
                    case "y":
                        msgByte[0] = msgType.voxelsY;
                        break;
                    case "z":
                        msgByte[0] = msgType.voxelsZ;
                        break;
                }
                var msgInt = new Uint16Array(msg, 8, 1);
                msgInt[0] = val;
                ws.send(msg);
            }
        }

        this.resetCamera = function () {
            if (ws) {
                var msg = new Uint8Array(1);
                msg[0] = msgType.resetCamera;
                ws.send(msg);
            }
        }

        this.createMesh = function (name) {
            if (ws) {

                var out = stringToUtf8ByteArray(name);
                var msg = new Uint8Array(1 + out.length);
                for (i = 0; i < out.length; i++) {
                    msg[i + 1] = out[i];
                }
                msg[0] = msgType.createMesh;
                ws.send(msg);
            }
        }

        this.onMeshCreated = function (filename) {

        }

        this.open = function (callback) {
            ws = new WebSocket(this.webSocketUrl);
            ws.onopen = function (event) {
                callback();
            };

            ws.binaryType = "arraybuffer"
            ws.onmessage = function (event) {
                var payload = new Uint8Array(pako.inflate(event.data));
                // the first integer represents the message type
                switch (payload[0]) {

                    // new frame for the scene reconstruction
                    case msgType.reconstructionImage:
                        var j = 0;
                        for (i = 0; i < reconstructionImage.data.length; i += 4) {
                            j = i + 1;
                            reconstructionImage.data[i] = payload[j+ 2];
                            reconstructionImage.data[i + 1] = payload[j + 1];
                            reconstructionImage.data[i + 2] = payload[j];
                            reconstructionImage.data[i + 3] = 255;
                        }
                        reconstructionContext.putImageData(reconstructionImage, 0, 0);
                        break;

                    case msgType.createMeshComplete:
                        var str = Utf8ArrayToStr(payload, 1);
                        _self.onMeshCreated(str);
                        break;
                }
            }
        }

        var stringToUtf8ByteArray = function(str) {
            // TODO(user): Use native implementations if/when available
            str = str.replace(/\r\n/g, '\n');
            var out = []; var p = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if (c < 128) {
                    out[p++] = c;
                } else if (c < 2048) {
                    out[p++] = (c >> 6) | 192;
                    out[p++] = (c & 63) | 128;
                } else {
                    out[p++] = (c >> 12) | 224;
                    out[p++] = ((c >> 6) & 63) | 128;
                    out[p++] = (c & 63) | 128;
                }
            }
            return out;
        };

        var  Utf8ArrayToStr = function(array, offset) {
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = array.length;
            i = offset;
            while(i < len) {
                c = array[i++];
                switch(c >> 4)
                {
                    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                        // 0xxxxxxx
                        out += String.fromCharCode(c);
                        break;
                    case 12: case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = array[i++];
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = array[i++];
                        char3 = array[i++];
                        out += String.fromCharCode(((c & 0x0F) << 12) |
                                       ((char2 & 0x3F) << 6) |
                                       ((char3 & 0x3F) << 0));
                        break;
                }
            }

            return out;
        }

        this.init();
    }
    kinect2Fusion.Kinect2Fusion = _kinect2Fusion;

}(window.kinect2Fusion = window.kinect2Fusion || {}, undefined));
