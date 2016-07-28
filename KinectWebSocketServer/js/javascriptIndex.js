var fusion = new kinect2Fusion.Kinect2Fusion();
fusion.setReconstructionCanvas(document.getElementById('bodyCanvas'));
fusion.open(function () {
    console.log("callback");
});

$(document).ready(function () {
    $("#btn-save").click(function () {
        $("#create-mesh-name").show();
        $("#create-mesh-wait").hide();
        $("#create-mesh-confirm").hide();
        $("#btn-mesh-create").show();
        $("#btn-mesh-download").hide();
        $('#create-mesh-modal').modal()
    });

    $("#btn-mesh-create").click(function () {
        fusion.createMesh($("#txt-mesh-name").val() + ".ply");
        $("#create-mesh-name").hide();
        $("#create-mesh-wait").show();
        $("#create-mesh-confirm").hide();
        $("#btn-mesh-create").hide();
        $("#btn-mesh-download").show();
        $("#btn-mesh-download").addClass("disabled");
    });

    fusion.onMeshCreated = function (str) {
        $("#create-mesh-name").hide();
        $("#create-mesh-wait").hide();
        $("#create-mesh-confirm").show();
        $("#btn-mesh-create").hide();
        $("#btn-mesh-download").show();
        $("#btn-mesh-download").removeClass("disabled");
    }

    $("#btn-mesh-download").click(function () {
        window.open("../bin/Debug/mesh/" + $("#txt-mesh-name").val() + ".ply", '_blank');
        $('#create-mesh-modal').modal('hide');
    });

    $("#btn-reset-rec").click(function () {
        fusion.resetReconstruction();
    });

    $("#btn-reset-camera").click(function () {
        fusion.resetCamera();
    });

    $("#ckb-camera-pose").change(function (a, c) {
        fusion.findCameraPose($(this).prop("checked"));
    });

    $("#ckb-color").change(function (a, c) {
        fusion.findCameraPose($(this).prop("checked"));
    });

    $("input[name=rd-texture]").change(function () {
        if ($(this).prop("checked") == true) {
            switch ($(this).attr("id")) {
                case "rd-volume":
                    fusion.volumeTexture();
                    break;
                case "rd-color":
                    fusion.colorTexture();
                    break;
                case "rd-normals":
                    fusion.normalsTexture();
                    break;
            }
        }
    });

    $("#ckb-kinect-view").change(function (a, c) {
        fusion.kinectView($(this).prop("checked"));
    });
    $("#ckb-mirror-depth").change(function (a, c) {
        fusion.mirrorDepth($(this).prop("checked"));
    });

    $("#ckb-pause").change(function (a, c) {
        fusion.pauseIntegration($(this).prop("checked"));
    });

    $("#sl-depth-range").slider({
        range: true,
        min: 0.5,
        max: 8.0,
        step: 0.01,
        values: [0.50, 8.0],
        slide: function (event, ui) {
            $("#depth-range").val(ui.values[0] + "m - " + ui.values[1] + "m");
            fusion.depthRange(ui.values[0], ui.values[1]);
        }
    });

    $("#depth-range").val($("#sl-depth-range").slider("values", 0) +
      "m - " + $("#sl-depth-range").slider("values", 1) + "m");


    $("#sl-int-weight").slider({
        min: 1,
        max: 1000,
        step: 1,
        value: 200,
        range: "min",
        slide: function (event, ui) {
            $("#int-weight").val(ui.value);
            fusion.integrationWeight(ui.value);
        }
    });
    $("#int-weight").val($("#sl-int-weight").slider("value"));

    $("#sl-voxel-meter").slider({
        min: 128,
        max: 768,
        step: 128,
        value: 256,
        range: "min",
        slide: function (event, ui) {
            $("#voxel-meter").val(ui.value);
            fusion.voxelPerMeter(ui.value);
        }
    });
    $("#voxel-meter").val($("#sl-voxel-meter").slider("value"));

    $("#sl-res-x").slider({
        min: 128,
        max: 512,
        step: 128,
        value: 384,
        range: "min",
        slide: function (event, ui) {
            $("#res-x").val(ui.value);
            fusion.voxels("x", ui.value);
        }
    });
    $("#res-x").val($("#sl-res-x").slider("value"));

    $("#sl-res-y").slider({
        min: 128,
        max: 512,
        step: 128,
        value: 384,
        range: "min",
        slide: function (event, ui) {
            $("#res-y").val(ui.value);
            fusion.voxels("y", ui.value);
        }
    });
    $("#res-y").val($("#sl-res-y").slider("value"));

    $("#sl-res-z").slider({
        min: 128,
        max: 512,
        step: 128,
        value: 384,
        range: "min",
        slide: function (event, ui) {
            $("#res-z").val(ui.value);
            fusion.voxels("z", ui.value);
        }
    });
    $("#res-z").val($("#sl-res-z").slider("value"));


})

