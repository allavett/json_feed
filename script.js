// Get search word
var srchKWrd = window.location.href.match(/search=(.*)/);
if (srchKWrd == null) {srchKWrd = "*%3A*"} else if (srchKWrd[1] == ""){srchKWrd = "*%3A*"} else {srchKWrd = srchKWrd[1]}
var jsonFeed = 'http://uptsearch.cloudapp.net/solr/rss/select?q='+ srchKWrd +'&sort=date+desc&start=0&rows=100&wt=json&json.wrf=?&indent=true';
var feed = [];
var sources = [];
var titleCntPrSrc = 3;
var singleSrcExpand = false;

loadData();

// Load necessary data
function loadData() {
    $.getJSON(jsonFeed, function(data){
        $.each(data.response.docs, function(index, item) {
            feed.push(item);
            if ($.inArray(item.source, sources) == -1) {
                sources.push(item.source);
            }
        });
        $('<b>')
            .append(feed.length)
            .appendTo('div [label="stats"]');
        loadFeed();
    });
}
// Go through each source
function loadFeed (){
    $.each(sources, function(index, itemS) {
        $('#feed').append('<div id="'+ itemS +'-name" label="'+ itemS +'" class="sourceContainers">');
        buildHTML(itemS);
    });
}
// Build page items
function buildHTML(itemS){
    var sourceTitleCnt = feed.filter(function(item){return item.source == itemS}).length;
    var clickable = 'onClick="sourceView(this.id)" class="sources"';
    var count = 0;
    // Check witch view to show
    if (singleSrcExpand == true) {
        clickable = 'onClick="fullView(this.id)" class="sources"';
        count = -50;
    }else if ((singleSrcExpand == false) && (sourceTitleCnt <= titleCntPrSrc)) {
        clickable = 'class="sources-nc"';
    }
    $('<div id="'+ itemS +'" label="'+ itemS +'-info" '+ clickable +'>')
        .append(itemS +' <b>'+ sourceTitleCnt)
        .appendTo('div [label="' + itemS + '"]');

    $.each(feed, function(index, itemF) {
        if (itemF.source == itemS && count < titleCntPrSrc){
            count++;
            // Get image source and check if source is valid
            var imgSrc = itemF.description.match(/src="(\S*)"/)[1];
            if ((imgSrc.match(/.jpg/) == null) && (imgSrc.match(/.gif/) == null)) {
                imgSrc = "";
            }
            $('<div id="titles">')
                .append('<img src="'+ imgSrc +'"/>')
                .append('<a href="'+ itemF.link +'" target="_newtab"><h4>'+ itemF.title)
                .appendTo('div [label="' + itemF.source + '"]');
        }
    });
}

// Load all titles for single source
function sourceView(clckdSrc) {
    document.getElementById(clckdSrc +"-name").innerHTML = "";
    singleSrcExpand = true;
    buildHTML(clckdSrc);
}

// Load full view
function fullView(clckdSrc) {
    document.getElementById(clckdSrc +"-name").innerHTML = "";
    singleSrcExpand = false;
    buildHTML(clckdSrc);
}