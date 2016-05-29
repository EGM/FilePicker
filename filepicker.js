function FilePicker(basepath, callBack) {
	var self = this;
	//defaults
	var basePath = basepath || "/sdcard";
	this.callback = callBack || function() {};
	var fileFilter = "";
	var folderPath = basePath;
	//create dialog
	var dialog = app.CreateDialog();
	var layout = app.CreateLayout("linear", "fillxy,left");
	layout.SetPadding(0.01, 0.01, 0.01, 0.01);
	layout.SetMargins(0.01, 0.01, 0.01, 0.01);

	var web = app.CreateWebView(0.8, 0.8);
	layout.AddChild(web);
	web.LoadUrl("/Html/FilePickerDialog.html");
	
	var filter_layout = app.CreateLayout("linear", "horizontal,vcenter,left,filly");
	var filterTitle = app.CreateText("File Filter:", 0.2, -1);
	filter_layout.AddChild(filterTitle);
	var filterEdit = app.CreateTextEdit("", 0.58, -1);
	filterEdit.parent = this;
	filterEdit.SetOnChange(FilePicker_filterEdit_onChange);
	filterEdit.SetOnEnter(FilePicker_filterEdit_onEnter);
	filter_layout.AddChild(filterEdit);
	layout.AddChild(filter_layout);
	
	var buttons_layout = app.CreateLayout("linear", "horizontal,filly");
	//cancel button
	var cancel = app.CreateButton( "Cancel", 0.39, -1, "html");
	cancel.parent = this;
	cancel.SetOnTouch(FilePicker_cancel_onTouch);
	buttons_layout.AddChild(cancel);
	//ok button
	var ok = app.CreateButton( "Ok", 0.39, -1, "html");
	ok.parent = this;
	ok.SetOnTouch(FilePicker_ok_onTouch);
	buttons_layout.AddChild(ok);
	layout.AddChild(buttons_layout);
	
	//attach dialog
	dialog.AddLayout(layout);

	this.show = function() {
		dialog.Show();
	};
	this.hide = function() {
		dialog.Hide();
	};
	this.setFilter = function(filter) {
		fileFilter = filter;
	};
	this.setFolder = function(folderPath) {
		web.Execute("SetFolder('" + folderPath + "')");
	};
}//filePicker()

function FilePicker_filterEdit_onChange() {
	if (this.GetLineCount() > 1) {
		this.Undo();
	}
}

function FilePicker_filterEdit_onEnter() {
	var fileFilter = this.GetText();
	this.parent.setFilter(fileFilter);
	this.parent.web.Execute("SetFilter('" + fileFilter + "')");
}

function FilePicker_cancel_onTouch() {
	this.parent.hide();
}

function FilePicker_ok_onTouch() {
	var files = app.LoadText("files");
	var callback = this.parent.callback;
	files.split(",").forEach(
		function(file){
			callback(file);
		});
	this.parent.hide();
}

