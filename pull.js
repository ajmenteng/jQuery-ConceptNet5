//Author: John Wesly Chandra
//Email: johncha@bu.edu
//May 2015

(function ($) {
    $('button').on('click', function () {
		var oritext=$("#mytext").val().toLowerCase().trim(); 
		$("#results tbody").empty();
		
		//normalize the text and extract the words
		var rawtext = oritext.replace(/[,.]/g,"");
		var words = rawtext.split(/[ \n]/);
		
		//used for refining the results
		var exclude = ['the','a','is','at','in','on','of','an','to','it','be','or','but','as','i','his','hers','us','you','me','they','them'];
		
		//regex used for checking the keyword before querying
		var reg = /[a-z]/;
		
		//List of results. Used for preventing double display
		var result = {};
		
		for (var i=0;i<words.length;i++) {
			(function(i) {
				var word = words[i].trim();
				if(($.inArray(word,exclude)=== -1) && (reg.test(word))) {
					//query a word using conceptnet-api
					$.getJSON("http://conceptnet-api-1.media.mit.edu/data/5.3/search?rel=/r/AtLocation&end=/c/en/" + word+ '&limit=3', function (data) {
						if(data.numFound==3){
							if(result[word]) {
								result[word]++;
								$('td[id='+word+']').text(result[word]);
							}
							else {
								result[word]=1;								
								var reasons = "";
								$.each(data.edges, function (key, val) {
									reasons += val.surfaceText + '<br />';
								});	
								var row = $('<tr></tr>');
								row.append($('<td></td>').text(word));
								row.append($('<td></td>').html(reasons));
								row.append($('<td id='+word+'></td>').text(result[word]));
								$('#results').append(row);
							}
						}
					});

					if(i+1 < words.length){
						if(reg.test(words[i+1])) {
							var word2 = words[i] + "_" + words[i+1];
							
							//query a phrase (2 words) using conceptnet-api
							$.getJSON("http://conceptnet-api-1.media.mit.edu/data/5.3/search?rel=/r/AtLocation&end=/c/en/" + word2 + '&limit=3', function (data2) {
								if(data2.numFound==3){
									if(result[word2]) {
										result[word2]++;
										$('td[id='+word2+']').text(result[word2]);
									}
									else {
										result[word2]=1;
										var reasons2 = "";
										$.each(data2.edges, function (key2, val2) {
											reasons2 += val2.surfaceText + '<br />';
										});	
										var row2 = $('<tr></tr>');
										row2.append($('<td></td>').text(word2));
										row2.append($('<td></td>').html(reasons2));
										row2.append($('<td id='+word2+'></td>').text(result[word2]));
										$('#results').append(row2);
									}
								}
							});
						}
					}
				}
			})(i);
		}
    });
}(jQuery));