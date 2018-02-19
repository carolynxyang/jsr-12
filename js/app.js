

class newsItem{
	constructor(thumbnail, title, abstract, publisher, published_date, url, big_picture) {
	    this.thumbnail = thumbnail;
	    this.title = title;
	    this.abstract = abstract;
	    this.publisher = publisher;
	    this.published_date = published_date;
	    this.url = url;
	    this.big_picture = big_picture;
	}
}

class NewsSource{
	constructor(publisher, url){
		this.publisher = publisher;
		this.url = url;
	}
}

class NYTSource extends NewsSource{
	loadAndParse(){
		return $.ajax({
		    dataType: "json",
		    url: this.url,
		    method: 'GET',
		}).then(function(data) {
			console.log(data);
			var newsList = [];
			for (var i = 0; i < data.results.length; i++){
				var x = data.results[i];
				var item = new newsItem(x.multimedia[1].url, x.title, x.abstract, "New York Times", x.published_date, x.url, x.multimedia[4].url);
				newsList.push(item);
			}
			return newsList;
		})
	}
}

class NPRSource extends NewsSource{
	loadAndParse(){

		return $.ajax({
		    dataType: "json",
		    url: this.url,
		    method: 'GET',
		}).then(function(data) {
			console.log(data);
			var newsList = [];
			for (var i = 0; i < data.items.length; i++){
				var x = data.items[i];
				var item = new newsItem(x.image, x.title, x.summary, "NPR News", x.date_published, x.url, x.image);
				newsList.push(item);
			}
			return newsList;
		})
	}
}

function render(list){
	
	$("#main").html("");
	for (i = 0; i < list.length; i++){
		  var article = `
			<article class="article" publisher="`+list[i].publisher+`" index="`+i+`">
				<section class="featuredImage">
					<img src="`+list[i].thumbnail+`" alt="" />
				</section>
				<section class="articleContent">
					<a class="articleUrl" href="`+list[i].url+`"><h3>`+list[i].title+`</h3></a>
					<h6 class="articleabstract">`+list[i].abstract+`</h6>
				</section>
				<section class="impressions">
					526
				</section>
				<div class="clearfix"></div>
			</article>`;
      	$("#main").append(article);
	}
}

function filter(publisher, text){
	if(publisher==="All"){
		$(".article").show();
		return;
	}
	if(publisher){
		$(".article").each(function (index,item){
			if($(item).attr("publisher")===publisher){
				$(item).show();
			}else{
				$(item).hide();
			}
		})
	}else if(text){
		$(".article").each(function (index,item){
			if($(item).find(".articleabstract")[0].innerText.toLowerCase().indexOf(text)!== -1){
				$(item).show();
			}else{
				$(item).hide();
			}
		})
	}else{
		$(".article").show();
	}	
}

function updateSourceList(input){
	$("#sourcelist").html("");
	$("#sourcelist").append("<li><a>All</a></li>");
	input.forEach(function(item){
		$("#sourcelist").append("<li><a>"+item.publisher+"</a></li>");
	});
}


var sources = [
new NYTSource("New York Times", "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=409ce17a2ba0409da856ee9f6f817d57"),
new NPRSource("NPR News", "https://www.npr.org/feeds/1001/feed.json")
];
// Update source
updateSourceList(sources);
$(document).on("click","#sourcelist", function(){
	filter(event.target.innerText);
	$("nav ul li a span")[0].innerText = event.target.innerText;

})
// Loading
var requests = [];
sources.forEach(
	function(item){
		requests.push(item.loadAndParse());
	}
);
// When completed
var fullList = [];
$.when.apply( null, requests ).then(function() {
	
	for(var i = 0; i < arguments.length;i++){
		fullList = fullList.concat(arguments[i]);
	}
	render(fullList, null);
	
});






$(document).on("click",".article", function (event){
	event.preventDefault();	
	$("#popUp").removeClass("hidden");
	var item = fullList[$(event.currentTarget).attr("index")];
	console.log(item);
	$("#popUp div h1")[0].innerText = item.title;
	$("#popUp div p")[0].innerText = item.abstract;
	$("#popUp div img")[0].src = item.big_picture;
	$("#popUp div a")[0].href = item.url;

})

$(document).on("click", ".closePopUp", function (){
	$("#popUp").addClass("hidden");
})


$("#search a").on("click", function(){
	$("#search").toggleClass("active");
});

$("#search input").on("keyup",function(data){
	filter(null,$("#search input")[0].value);
})