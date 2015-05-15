var catsClicker = catsClicker || {};

catsClicker.model = {
	
	//Initialize the array
	init: function(){
		this.catArray = catsClicker.cats;		
	},
	//Return the cat array
	getCatArray: function(){
		return this.catArray;
	}, 
	//Update clicks for specific cat
	saveCatClicks: function(id, clickCount){
		var catObj = this.getCatByID(id);
		catObj.clickCount = clickCount;

	},
	//Return specific cat object
	getCat: function(index){
		return this.catArray[index];
	},
	//Return number of cats
	getCatArraySize: function(){
		return this.catArray.length;
	},
	getCatByID: function(id){
		for(var i = 0; i < this.catArray.length; i++){
			if(this.catArray[i].id == id ){
				return this.catArray[i];
				break;
			}
		}		
	}
};

catsClicker.catObjectView = {
	init: function(){
		var catImage = document.getElementById("CurrentCat");	
		catImage.addEventListener("click", this.updateClickCount);
	    catsClicker.controller.switchCat(1);	
	},
	//Set the current click count
	setClickCount: function(clickCount){
		var clickCountEl = document.getElementById("clickCount");
		clickCountEl.innerHTML = clickCount;		
	},
	//Get the current click Count
	getClickCount: function(){
		var clickCountEl = document.getElementById("clickCount");
		return parseInt(clickCountEl.innerHTML);		
	},
	//Increment click count
	updateClickCount: function(){
		var clickCountEl = document.getElementById("clickCount");
		clickCountEl.innerHTML = parseInt(clickCountEl.innerHTML, 10) + 1;
		catsClicker.controller.saveCurrentCatClicks();
	},
	//Set current cat image
	setCatImage: function(imageSource){
		var currentCatEl = document.getElementById("CurrentCat");
		currentCatEl.src = imageSource;		
	},
	//Get the current title
	getCurrentTitle: function(){
		var currentTitle = document.getElementById("CurrentCatTitle").innerHTML;
		return currentTitle;		
	},
	//Set the current title
	setCurrentTitle: function(title){
		var currentCatTitle = document.getElementById("CurrentCatTitle");
		currentCatTitle.innerHTML = title;			
	},
	//Get current cat id
	getCurrentID: function(){
		var currentID = document.getElementById("id").innerHTML;
		return currentID;				
	},
	//set current cat id
	setCurrentID: function(id){
		var currentCatID = document.getElementById("id");
		currentCatID.innerHTML = id;			
	}	
};

catsClicker.catListView = {
	init: function(numOfCats){
		this.table = document.getElementById("catsTable");	
		this.render(numOfCats);
	},
	render: function(numOfCats){
		var currentRow;
		var currentCell;
		var currentCat;
		
		this.table.innerHTML = "";
		for(var i = 0; i < numOfCats; i++){
			currentCat = catsClicker.controller.getCat(i);
			currentRow = this.table.insertRow(i);
			currentCell = currentRow.insertCell(0);
			currentCell.innerHTML = currentCat.title;
			currentCell.addEventListener("click", (function(id){
				return function(){
					catsClicker.controller.switchCat(id);
					catsClicker.adminView.hideAdminForm();
					catsClicker.adminView.init();
				}
			})(currentCat.id));
		}
	}
	
};

catsClicker.adminView = {
	init: function(){
		var adminButton = document.getElementById("AdminButton");
		var cancelButton = document.getElementById("Cancel");
		var saveButton = document.getElementById("SaveButton");
		
		this.adminForm = document.getElementById("AdminForm");
		
		adminButton.addEventListener("click", this.showAdminForm);
		cancelButton.addEventListener("click", this.hideAdminForm);		
		saveButton.addEventListener("click", this.saveAdminFields);
	},
	//Because these are called in an eventlistener, "this" is the global object
	//and not catsClicker.adminView. Weird
	showAdminForm: function(){
		var catID = catsClicker.catObjectView.getCurrentID();
		var catObj = catsClicker.controller.getCatByID(catID);
		
		catsClicker.adminView.name = document.getElementById("Name");
		catsClicker.adminView.url = document.getElementById("URL");
		catsClicker.adminView.clickCount = document.getElementById("Clicks");
		
		catsClicker.adminView.name.value = catObj.title;
		catsClicker.adminView.url.value = catObj.imageSource;
		catsClicker.adminView.clickCount.value = catObj.clickCount;
		
		catsClicker.adminView.adminForm.style.visibility = "visible";
	},
	hideAdminForm: function(){
		catsClicker.adminView.adminForm.style.visibility = "hidden";
	},
	saveAdminFields: function(){
		var cats = catsClicker.controller.getNumberOfCats();
		var catID = catsClicker.catObjectView.getCurrentID();
		var catObj = catsClicker.controller.getCatByID(catID);
		
		catObj.imageSource = catsClicker.adminView.url.value;
		catObj.title = catsClicker.adminView.name.value;
		catObj.clickCount = catsClicker.adminView.clickCount.value;
		catsClicker.adminView.hideAdminForm();
		catsClicker.catListView.render(cats);
		catsClicker.controller.switchCat(catID);
	}
};

catsClicker.controller = {
	init: function(){
		catsClicker.model.init();
		catsClicker.catObjectView.init();
		catsClicker.catListView.init(catsClicker.model.getCatArraySize());
		catsClicker.adminView.init();
	},
	switchCat: function(id){
		var newCatObj = catsClicker.model.getCatByID(id); 
		catsClicker.catObjectView.setCatImage(newCatObj.imageSource);
		catsClicker.catObjectView.setClickCount(newCatObj.clickCount);
		catsClicker.catObjectView.setCurrentTitle(newCatObj.title);	
		catsClicker.catObjectView.setCurrentID(newCatObj.id);			
	},
	getCat: function(index){
		return catsClicker.model.getCat(index);
	},
	getCatByID: function(id){
		return catsClicker.model.getCatByID(id);
	},
	saveCurrentCatClicks: function(){
		var clickCount = catsClicker.catObjectView.getClickCount();
		var id = catsClicker.catObjectView.getCurrentID();
		catsClicker.model.saveCatClicks(id, clickCount);
	},
	getNumberOfCats: function(){
		return catsClicker.model.getCatArraySize();
	}
	
};		
