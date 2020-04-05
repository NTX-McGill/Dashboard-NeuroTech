using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using SocketIOSharp.Client;

public class SocketIOConnector : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        SocketIOClient client = new SocketIOClient(SocketIOClient.Scheme.ws, "localhost", 4001);
        client.Connect();
        client.On(SocketIOClient.Event.CONNECTION, (Newtonsoft.Json.Linq.JToken[] Data) => // Type of argument is JToken[].
		    {
  			  print("Connected!");
		    }
    );

		client.On("Finger", (Data) => 
		  {
  			int index = (int) Data[0];
  			string[] allFingers = {"a","s","d","f","j","k","l","semicolon","space"};
			  string finger = "a";
			  finger = allFingers[index];
  			print(finger);
		  }
    );

}

    // Update is called once per frame
    void Update()
    {
        
    }
}
