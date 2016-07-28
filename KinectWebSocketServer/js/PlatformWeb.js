(function (PlatformWeb, undefined){

  var _commandPlatform = {
      MovePlatform:0,
      ChangeRotation:1,
      Degree:2,
      NumberStep:3,
      PauseTime:4,
      Speed:5,
      GetStorage:6
  }

  PlatformWeb.Command = _commandPlatform;

  var _movementPlatform = {
    SingleStep:1,
    PhotoSeq:2,
    Continuous:3
  }

  PlatformWeb.MovementPlatform = _movementPlatform;

  var _directionRot = {
    CW:0,
    CCW:1
  }

  PlatformWeb.DirectionRot = _directionRot;

  var _defaultSetting = {
    speed:100,
    degree:360,
    step:1,
    pause:1,
    direction:0
  }

  //Apertura connessione e comunicazione con Piattaforma wifi
  var _instance = function(){
    var _self = this;

    var serverWS;

    //elementi html per informazioni pedana
    var htmlSpeed;
    var htmlDegree;
    var htmlStep;
    var htmlPause;
    var htmlSense;
    var htmlMove;

    this.webPlatformUrl = "ws://127.0.0.1:8787/Platform";

    this.Open = function(callback){
      _self.serverWS = new WebSocket(_self.webPlatformUrl);
      _self.serverWS.onopen = function () {
        console.log("Connection with Server Opened!");

        //_self.ResetParameters();
        //_self.SendCommand(PlatformWeb.Command.GetStorage);

        //funzione di callback per settaggio
        callback();

        /*$("#buttSend").click(function(){
          _self.StartRotation(PlatformWeb.MovementPlatform.SingleStep);
        });*/
      }

      _self.serverWS.onmessage = function (event) {
          console.log("Message from Server: ");

          //var obj = JSON.parse(event.data);
          //console.log(obj.option)

          //AggiornamentoParametri
          _self.UpdateDataPlat(event.data);
      }

      _self.serverWS.onerror = function (event) {
         console.log("Error with Server!");
         console.log(event.data);
         setTimeout(_self.Open(callback), 1000);
      }

      _self.serverWS.onclose = function (event) {
          console.log("Connection with Server closed!");
      }

      //Accensione della pedana e rotazione secondo la modalità in input
      _self.StartRotation = function (typeOfRotation){
        _self.SendCommand(PlatformWeb.Command.MovePlatform, typeOfRotation);
      }

      //Modifica settaggio pedana
      _self.SendCommand = function (command, value = ""){
        var stringJ = '{"command" : "'+ command +'", "value" : "'+ value +'"}';
        console.log(stringJ)
        _self.serverWS.send(stringJ);
      }

      //reset parametri pedana
      _self.ResetParameters = function () {
        //speed
        _self.SendCommand(PlatformWeb.Command.Speed, _defaultSetting.speed);

        //degree
        _self.SendCommand(PlatformWeb.Command.Degree, _defaultSetting.degree);

        //step
        _self.SendCommand(PlatformWeb.Command.NumberStep, _defaultSetting.step);

        //pause
        _self.SendCommand(PlatformWeb.Command.PauseTime, _defaultSetting.pause);

        //direction
        _self.SendCommand(PlatformWeb.Command.ChangeRotation, _defaultSetting.direction);
      }

      //Aggiornamento elementi html con valori pedana
      _self.UpdateDataPlat = function(jsonMessage){
        var obj = JSON.parse(jsonMessage);
        console.log(obj);

        for(var key in obj.value){
          if(key == "SPEED" && htmlSpeed) console.log(obj.value[key]);
          if(key == "DEGREE" && htmlDegree) console.log(obj.value[key]);
          if(key == "STEP" && htmlStep) console.log(obj.value[key]);
          if(key == "PAUSE" && htmlPause) console.log(obj.value[key]);
          if(key == "SENSE" && htmlSense) console.log(obj.value[key]);
          if(key == "ONE_STEP" && htmlMove) console.log(obj.value[key]);
        }
      }
    }
  }
  PlatformWeb.Instance = _instance;


}(window.PlatformWeb = window.PlatformWeb || {}, undefined));
