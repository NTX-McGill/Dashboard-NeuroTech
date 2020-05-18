using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using SocketIOSharp.Client;

public class tester : MonoBehaviour
{
	InputField textBox;
	string[] allFingers = {"a","s","d","f","j","k","l",";","_"};
	string finger = "a";
	string text = "";
    // Start is called before the first frame update
    void Start()
    {
    	textBox = GetComponent<InputField>();
    	SocketIOClient client = new SocketIOClient(SocketIOClient.Scheme.ws, "localhost", 4001);
        client.Connect();
    //     client.On(SocketIOClient.Event.CONNECTION, (Newtonsoft.Json.Linq.JToken[] Data) => // Type of argument is JToken[].
		  //   {
  		// 	  print("Connected!");
		 	// }
    // 	);

		client.On("Finger", (Data) => 
		  {
		  	int index = (int) Data[0];
			finger = allFingers[index];
			text = text + finger;
		  }
    	);
    }

    // Update is called once per frame
    void Update()
    {
        textBox.text = text;
    }
}
