var url = ["https://api.nytimes.com/svc/topstories/v2/home.json?api-key=409ce17a2ba0409da856ee9f6f817d57", 
			"http://www.buzzfeed.com/api/v2/feeds/news", 
			"https://www.npr.org/feeds/1001/feed.json"];

var newsList = []


function render(filter){
	if(filter){renderList = newsList.filter(x => x.publisher===filter);}
	else{renderList = newsList;}
	$("#main").html("");

	for (i = 0; i < renderList.length; i++){
		  var article = `
			<article class="article">
				<section class="featuredImage">
					<img src="`+renderList[i].thumbnail+`" alt="" />
				</section>
				<section class="articleContent">
					<a class="articleUrl" href="`+renderList[i].url+`"><h3>`+renderList[i].title+`</h3></a>
					<h6 class="articleabstract">`+renderList[i].abstract+`</h6>
				</section>
				<section class="impressions">
					526
				</section>
				<div class="clearfix"></div>
			</article>`;
      	$("#main").append(article);
	}
}

$.when(
	//NYT
	$.ajax({
	    dataType: "json",
	    url: url[0],
	    method: 'GET',
	}).then(function(data) {
		for (i = 0; i < data.results.length; i++){
			var x = data.results[i];
			item = new newsItem(x.multimedia[1].url, x.title, x.abstract, "New York Times", x.published_date, x.url);
			newsList.push(item);
		}
	}),
	//NPR
	$.ajax({
	    dataType: "json",
	    url: url[2],
	    method: 'GET',
	}).then(function(data) {
		for (i = 0; i < data.items.length; i++){
			var x = data.items[i];
			item = new newsItem(x.image, x.title, x.summary, "NPR", x.date_published, x.url);
			newsList.push(item);
		}
	})
).then(function(){
	render();
}
)

$(document).on("click", "article", function(evt){
	evt.preventDefault();
	console.log();

});



function newsItem(thumbnail, title, abstract, publisher, published_date, url) {
    this.thumbnail = thumbnail;
    this.title = title;
    this.abstract = abstract;
    this.publisher = publisher;
    this.published_date = published_date;
    this.url = url;
}


$("#article").on("click", function (){

	$("#popUp").toggleClass("hidden");
})

$("#closePopUp").on("click", function (){

	$("#popUp").addClass("hidden");
})

