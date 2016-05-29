app.LoadScript("filepicker.js");

//Called when application is started
function OnStart() {
    //Create a layout with objects vertically centered.
    lay = app.CreateLayout("linear", "Vertical,FillXY");    

    //Create a text label and add it to layout.
    btn = app.CreateButton("FilePicker Demo");
    lay.AddChild(btn);
    btn.SetOnTouch(btn_OnTouch);
	
    //create a file picker with basepath /sdcard
    pick = new FilePicker("/sdcard", mycallback);    
	
    //Add layout to app.    
    app.AddLayout(lay);
}//Onstart()

function btn_OnTouch() {
	pick.setFolder(app.GetPath());
	pick.show();    
}//btn_OnTouch()

function mycallback(fullpath) {
	if (fullpath.slice(-3) == ".js") {
		app.Alert(app.ReadFile(fullpath));
	}
}//mycallback()