//declare global variables
var domain = "https://duckduckgo-duckduckgo-zero-click-info.p.mashape.com/?&format=json&no_html=1&q=";

//function to create DOM elements
function loadButton() {

    //Creating search button
    document.getElementById('buttonSearch').addEventListener('click', performSearch);
    //creating search input box
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
    //enter click in the text input box    
    var keyCode = e.keyCode;
        if(keyCode == 13){
            performSearch();
        }
    });
    //adding a close button to the overlay
    document.getElementById('closeButton').addEventListener('click', function() {
        document.getElementById('overlay').style.display = "none";
    });
}

//search function
function performSearch() {

        var reqTerm = document.getElementById('searchInput').value;

        console.log(reqTerm);

        if (reqTerm == "") {
            alert("Please input search query.");
        }

        else {
            getResults(reqTerm);
        }

}

//xml http request
function myRequest(reqTerm, callback) {

    var Request = new XMLHttpRequest();
    Request.open('GET', domain + reqTerm);
    Request.setRequestHeader("X-Mashape-Key", "4YTNjn5fQBmshoofrBozILjojUfLp1HekvyjsnkY2jCyPdxz34");
    Request.setRequestHeader('Accept', 'application/json');

    Request.onreadystatechange = function () {
        
        if (this.readyState === 4) {

            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);

            var response = Request.responseText;
            var data = JSON.parse(response);

            callback(data);

        }
    };
    Request.send(JSON.stringify());
}

function getResults(reqTerm) {

    myRequest(reqTerm, function(data) {
        displayResults(data);
    })
}

//displaying results on the page
function displayResults(data) {

    var topics = data.RelatedTopics;
    var fragment = document.createDocumentFragment();
    var container  = document.getElementById('container');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (var i = 0; i < topics.length; i++) {

        var wrapper = document.createElement('div');
        var image = document.createElement('img');
        var link = document.createElement('a');
        
        wrapper.classList.add('item');


        if (topics[i].FirstURL) {
            var item = topics[i];
            var icon = item.Icon;
            var poster = icon.URL;
            //var item = topics[i];

            link.href = item.FirstURL;
            link.textContent = item.Text.substring(0, 80);
            link.target = "_blank"; 
            link.maxlength = 30;

            //putting a generic image in place of an item that has no icon to be displayed
            if (poster == null || poster == "") {
                image.src = "img/sample.png";
            }

            else {
                image.src = poster;
            }

            image.addEventListener('click', function(item) {
                return function() {
                    console.log('Click:', item);
                    displayInfo(item);
                }
            }(item));

            wrapper.appendChild(image);
            wrapper.appendChild(link);

        }

        else {
            var item = topics[i];
            var subtopic = item.Topics;

            var category = document.createElement('h2');
            category.id = 'cat';
            category.textContent = item.Name.substring(0, 80);
            // category.href = item.Topics.FirstURL;
            wrapper.appendChild(category);
            
            wrapper.addEventListener('click', function(subtopic) {
                return function() {
                console.log('Click:', subtopic);
                showMore(subtopic);
                }
            }(subtopic));
        }

            fragment.appendChild(wrapper);
    }
        container.appendChild(fragment);
};

//displaying subtopics after pressing on additional category button
function showMore(subtopic) {

    var fragment = document.createDocumentFragment();
    var container  = document.getElementById('container');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

        for (var j = 0; j < subtopic.length; j++) {

        var wrapper = document.createElement('div');
        var image = document.createElement('img');
        var link = document.createElement('a');
        wrapper.classList.add('item');


            if (subtopic[j].FirstURL) {
            var item = subtopic[j];
            var icon = item.Icon;
            var poster = icon.URL;
            //var item = topics[i];

            link.href = item.FirstURL;
            link.textContent = item.Text.substring(0, 80);
            link.target = "_blank"; 
            link.maxlength = 30;

            //putting a generic image in place of an item that has no icon to be displayed
            if (poster == null || poster == "") {
                image.src = "img/sample.png";
            }

            else {
                image.src = poster;
            }

            image.addEventListener('click', function(item) {
                return function() {
            console.log('Click:', item);
            displayInfo(item);
                }
            }(item));

            wrapper.appendChild(image);
            wrapper.appendChild(link);

            }

            else {
                var item = subtopic[j];
                // var subtopic = item.Topics;

                var category = document.createElement('a');
                category.id = 'cat';
                category.textContent = item.Name.substring(0, 50);
                // category.href = item.Topics.FirstURL;
                wrapper.appendChild(category);
            }

            fragment.appendChild(wrapper);
    }
        container.appendChild(fragment);
}

//displaying additional info about an item in a pop-up
function displayInfo(item) {

    var desc = item.Text;
    var img = item.Icon.URL;
    
    console.log('Showing data:', item);

    document.getElementById('description').textContent = desc;
    
    //putting a generic image in place of an item that has no icon to be displayed
    if(img == "" || img == null){
        document.getElementById('img').src = "img/sample.png";
    }
    else {
        document.getElementById('img').src = img;
    }
    document.getElementById('overlay').style.display = "block";
}




