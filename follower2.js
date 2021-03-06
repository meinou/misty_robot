function Activate() {
    misty.ChangeDisplayImage("Pupil.png");
    misty.Drive(50, 0, 0, 1000);
   // RegisterEvents(true);

   //misty.UnregisterEvent("MeetPerson");
   misty.Debug("start");
	misty.AddPropertyTest("MeetPerson", "DistanceInMeters", ">=", 0, "double");
    misty.RegisterEvent("MeetPerson", "ReadSensors", "TimeOfFlight", 100);
    misty.Debug("finish");
    
	// misty.AddPropertyTest("FaceRec", "PersonName", "!==", "unknown person", "string");
    // misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);
    
    misty.ChangeDisplayImage("Angry.jpg");
}

function ReadSensors() {
   // console.log("khsgf");
   misty.Drive(50, 0, 0, 1000);
   //misty.ChangeDisplayImage("Eye.jpg");
   //misty.Drive(50, 0, 0, 1000);
    misty.Debug("here");


    var data = misty.GetEventData("MeetPerson")
    var MeetPerson = JSON.parse(data);
    var distance = 0.4;
    var angle = 0;

    if (MeetPerson !== undefined && 
        MeetPerson.PropertyTestResults[0] !== undefined && 
        MeetPerson.PropertyTestResults[0].PropertyParent != undefined) { 
            misty.Debug("gonna stop");
            misty.Stop();
            misty.ChangeDisplayImage("Brow.jpg");
    
            distance = MeetPerson.PropertyTestResults[0].PropertyParent.DistanceInMeters;
         //   angle = MeetPerson.PropertyTestResults[1].PropertyParent.DistanceInMeters > MeetPerson.PropertyTestResults[2].PropertyParent.DistanceInMeters ? 10 : -10;
         //   if (MeetPerson.PropertyTestResults[1].PropertyParent.DistanceInMeters === MeetPerson.PropertyTestResults[2].PropertyParent.DistanceInMeters) angle = 0;
        }
        const desired = 0.3;
        const k = 80;
        var velocity = distance ? (distance - desired)*k : 50;
                    
        misty.Drive(velocity, angle, 0, 1000);

 //       misty.Debug("search for face");
        
        // misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
        // misty.AddPropertyTest("FaceRec", "PersonName", "!==", "unknown person", "string");
        // misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);
        // misty.StartFaceRecognition();
        
        // if (distance < 0.4) {
        //     misty.Debug("search for face");
        //     misty.StartFaceRecognition();
        //     misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
        //     misty.ChangeDisplayImage("Mask.jpg");
        //     misty.Stop();
        //     misty.Drive(10, 0, 0, 1000);
        // }
        // else {
        //     misty.ChangeDisplayImage("Love.jpg");
        // }
}



function FaceRec_Callback() {
	misty.Debug("Face rec callback");
	var obj = JSON.parse(misty.GetEventData("FaceRec"));
	
	misty.Debug(JSON.stringify(obj));

	if (obj !== undefined && obj.PropertyTestResults[0] !== undefined && obj.PropertyTestResults[0].PropertyParent != undefined && obj.PropertyTestResults[0].PropertyParent.PersonName != undefined && obj.PropertyTestResults[0].PropertyParent.PersonName != "unknown person") {
		misty.Debug("Person Name: " + obj.PropertyTestResults[0].PropertyParent.PersonName);
		switch (obj.PropertyTestResults[0].PropertyParent.PersonName.toLowerCase()) {
			case "jason":
				RespondToFace("Happy.jpg", "004-WhaooooO.wav");
				break;
			case "anna":
				RespondToFace("Happy.jpg", "004-WhaooooO.wav");
				break;
			case "ian":
				RespondToFace("Happy.jpg", "002-Weerp.wav");
				/*HoldPose();*/
				break;
		}
	}

	misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
	misty.AddPropertyTest("FaceRec", "PersonName", "!==", "unknown person", "string");
	misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);

	misty.Debug("Exiting Face rec callback");
}

function RespondToFace(img, snd) {
	misty.ChangeDisplayImage(img);
	misty.PlayAudioClip(snd);
	misty.Pause(3000);
	ResetDisplay();
	misty.Pause(3000);
}

function ResetDisplay() {
	misty.ChangeDisplayImage("Content.jpg");
}

function Deactivate() {  
	misty.StopFaceRecognition();
	misty.UnregisterEvent("FaceRec");
}