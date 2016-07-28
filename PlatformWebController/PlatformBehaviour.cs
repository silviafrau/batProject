using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;

namespace PlatformWebController
{
    public class PlatformBehaviour : WebSocketBehavior
    {
        //credenziali d'accesso alle funzionalità della pedana
        private string user = "root";
        private string pass = "B160000038";

        //Url per il collegamento e l'avvio delle funzionalità
        private const string UrlPlat = "http://192.168.240.1";
        private const string GetData = "/data/get";
        private const string PutData = "/data/put";

        private const string UrlStartMovement = "/ONE_STEP/";
        private const string UrlDegreeRot = "/DEGREE/";
        private const string UrlNumberStep = "/STEP/";
        private const string UrlTimeInterval = "/PAUSE/";
        private const string UrlChangeRot = "/SENSE/";
        private const string UrlSpeedRot = "/SPEED/";

        enum CommandPlatform { MovePlatform = 0, ChangeRot, Degree, NumberStep, PauseTime, Speed, GetStorage };


        protected string AuthenticationPlat()
        {
            string tok = user + ":" + pass;
            string encode = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(tok));

            return "Basic " + encode;
        }

        protected string GetStringResponse(Stream streamData)
        {
            StreamReader reader = new StreamReader(streamData);

            return reader.ReadToEnd();
        }

        protected string SendCommandPlat(string typeData, string command = "", string value = "")
        {
            string url = UrlPlat + typeData + command + value;
            Console.WriteLine(url);
            WebRequest wbPlat = WebRequest.Create(url);
            wbPlat.Headers.Add("Authorization", AuthenticationPlat());

            WebResponse resp = wbPlat.GetResponse();
            return GetStringResponse(resp.GetResponseStream());
        }

        string ParseRequest(CommandInputPlat com)
        {
            if (int.Parse(com.command) == (int)CommandPlatform.GetStorage)
                return GetData;

            string req = PutData;
            //avvio movimento piattaforma
            if (int.Parse(com.command) == (int)CommandPlatform.MovePlatform)
            {
                req = req + UrlStartMovement;
            }
            //cambio rotazione
            else if (int.Parse(com.command) == (int)CommandPlatform.ChangeRot)
            {
                req = req + UrlChangeRot;
            }
            //modifica gradi rotazione singola/sequenzafotografica
            else if (int.Parse(com.command) == (int)CommandPlatform.Degree)
            {
                req = req + UrlDegreeRot;
            }
            //Modifica numero passi sequenza fotografica
            else if (int.Parse(com.command) == (int)CommandPlatform.NumberStep)
            {
                req = req + UrlNumberStep;
            }
            //modifica intervallo tra passi squenza fotografica
            else if (int.Parse(com.command) == (int)CommandPlatform.PauseTime)
            {
                req = req + UrlTimeInterval;
            }
            //modifica velocità rotazione
            else if (int.Parse(com.command) == (int)CommandPlatform.Speed)
            {
                req = req + UrlSpeedRot;
            }

            return req + com.value;

        }

        protected override void OnOpen()
        {
            base.OnOpen();
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            base.OnMessage(e);
            //Creazione stringa per interrogazione Platform
            CommandInputPlat com = JsonConvert.DeserializeObject<CommandInputPlat>(e.Data);
            string t = ParseRequest(com);
            string PlatFormResponse = SendCommandPlat(t);

            Send(PlatFormResponse);
        }

        protected override void OnError(WebSocketSharp.ErrorEventArgs e)
        {
            base.OnError(e);
        }

        protected override void OnClose(CloseEventArgs e)
        {
            base.OnClose(e);
        }
        static void Main(string[] args)
        { }
    }
}
