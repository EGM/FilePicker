var basePath = "/sdcard";
//var callback = function() {};
var fileFilter = "";
var folderPath = basePath;
var rowCount = 0;

function OnStart() {
	SetFolder(folderPath);
}

function ClearRows() {
	var table = document.getElementsByTagName("table")[0];
	var rows = table.rows;
	for (var i=0; i < rowCount; i++) {
		table.deleteRow(0);
	}
	rowCount = 0;
}

function AddRow(filename, isFolder) {
	var table = document.getElementsByTagName("table")[0];
	var row = table.insertRow(rowCount);
	row.setAttribute("id", "row" + rowCount); 
	row.setAttribute("onclick", "OnTouch('row" + rowCount + "');"); 
	rowCount += 1;
	if (filename.slice(0, 1) == ".") {
		row.classList.add("hidden"); 
	}
	row.innerHTML = "";
	if (filename == "..") {
		row.innerHTML += "<td class='folder up icon'>" + filename + "</td>";
	}
	else if (isFolder) {
		row.innerHTML += "<td class='folder icon'>" + filename + "</td>";
	}
	else {
		switch (filename.slice(filename.lastIndexOf("."))) {
			case ".js":
				row.innerHTML += "<td class='js icon'>" + filename + "</td>";
				break;
			case ".htm":
			case ".html":
				row.innerHTML += "<td class='html icon'>" + filename + "</td>";
				break;
			case ".gif":
			case ".jpeg":
			case ".jpg":
			case ".png":
				row.innerHTML += "<td class='img icon'>" + filename + "</td>";
				break;
			case ".json":
				row.innerHTML += "<td class='json icon'>" + filename + "</td>";
				break;
			case ".txt":
				row.innerHTML += "<td class='txt icon'>" + filename + "</td>";
				break;
			case ".xml":
				row.innerHTML += "<td class='xml icon'>" + filename + "</td>";
				break;
			default: 
				row.innerHTML += "<td class='file icon'>" + filename + "</td>";
				break;
		}
	}
	table.appendChild(row);
}

function isFolder(file) {
	return file.classList.contains("folder");
}

function OnTouch(rowId) {
	var row = document.getElementById(rowId);
	var file = row.cells[0];
	var filename = file.innerText;
	var newPath;
	if (isFolder(file)) {
		if (filename == "..") {
			SetFolder(folderPath.slice(0, folderPath.lastIndexOf("/")));
		}
		else {
			SetFolder(folderPath + "/" + filename);
		}
	}
	else {
		file.classList.toggle("selected");
		var selected = document.getElementsByClassName("selected");
		var selectedList = [];
		for (var i = 0; i < selected.length; i++) {
			selectedList.push(folderPath + "/" + selected[i].innerText);
		}
		app.SaveText("files", selectedList.join());
	}
}

function SetTitle(title) {
	var heading = document.getElementById("heading");
	if (title.length > 32) {
		title = "..." + title.slice(-31);
	}
	heading.innerText = title;
}

function SetFilter(filter) {
	fileFilter = filter;
	SetFolder(folderPath);
}

function SetFolder(newPath) {
	app.SaveText("files", newPath);
	ClearRows();
	folderPath = newPath;
	SetTitle(folderPath);
	if (folderPath != basePath) {
		AddRow("..", true);
	}
	var list = app.ListFolder(folderPath, fileFilter);

	list
		.sort(
		function(x, y) {
			return (x.toLowerCase() > y.toLowerCase()) ? 1: -1;
		})
		.forEach(
		function(filename) {
			var path = folderPath + "/" + filename;
			AddRow(filename, app.IsFolder(path));
		});
};
