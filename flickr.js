// Libs import
var Flickr = require("node-flickr");
var keys = {"api_key": "cdfbfa69405b9cf346fcb226f544a81e"}
var http = require('http');
var fs = require('fs');
var Jimp = require("jimp")

// Check app parameters
var outputLink;
if ( process.argv.length < 3 ) {
	console.log("error. USAGE : app.js keyword [outputLink]");
	return -1;
}
else{
	if (process.argv[3] === undefined) outputLink = './tmp/file.jpg';
	else outputLink = process.argv[3] 
}

// Flickr api instanciation
flickr = new Flickr(keys);

// Api calls
flickr.get("photos.search", {"tags":process.argv[2]}, function(err, result){
    if (err) return console.error(err);
    var phId = result.photos.photo[0].id;

    flickr.get("photos.getSizes", {"photo_id":phId}, function(err, result){
    	if (err) return console.error(err);
    	var sizes = result.sizes.size;

    	// Get large size
    	for (var i = 0; i < sizes.length; i++){

    	    if (sizes[i].label == 'Large'){ // URL retrieved !
    	    	
    	    	console.log("Image url : ");
    			console.log(sizes[i].source);
    			var link = sizes[i].source.replace('https://','http://');

    			// Save to file
    			var file = fs.createWriteStream(outputLink);
				var request = http.get(link, function(response) {
				  response.pipe(file);
				  //console.log("Temp file saved to " + outputLink);
				});

				file.on('finish', function(){
					Jimp.read(outputLink, function (err, lenna) {
						if (err) throw err;
						Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then(function (font) {
						    lenna.print(font, 10, 10, process.argv[2]);
						    lenna
						         .greyscale()                 // set greyscale
						         .write(outputLink); // save

				  			console.log("File saved to " + outputLink);
						});
					});
				});

    		}
    	}

	 });


});
