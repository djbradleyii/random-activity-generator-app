function displayYouTubeResults(responseJson){
    for(let item in responseJson.items){
        let videoLink = "";
        if(responseJson.items[item].id.videoId){
            videoLink = `https://www.youtube.com/watch?v=${responseJson.items[item].id.videoId}`;
        }else{
            videoLink = `https://www.youtube.com/channel/${responseJson.items[item].snippet.channelId}`
        }
        $('.youtube-results-list').append(
            `<li class="youtube-result-item"><figure>
            <a href="${videoLink}" target="_blank"><img src="${responseJson.items[item].snippet.thumbnails.high.url}" alt="${responseJson.items[item].snippet.title}" /></a>
            <figcaption>${responseJson.items[item].snippet.title}</figcaption>
            </figure></li>`
        );
    }
}

function getYouTubeResults(activity){
    activity = encodeURIComponent(activity);
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${activity}&maxResults=16&key=AIzaSyDZ5YIHJJ6X580UjPPKGLCRYBn5ITuZ-G8`;

    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error(response.statusText);
        }
    })
    .then(responseJson => {
        displayYouTubeResults(responseJson);
    })
    .catch( error => console.log(`Something went wrong. ${error.message}`))
}

function displayActivity(responseJson){
    let priceIndicator = "";
    let activityType = responseJson.type;

    if(responseJson.price === 0) {
        priceIndicator = "Possibly Free";
    }else if(responseJson.price > 0 && responseJson.price < 0.5){
        priceIndicator = "Potential Charge";
    }else if(responseJson.price > .5){
        priceIndicator = "Go to ATM";
    }

    $(`.activity-display`).html(
        `<ul>
            <li><h3>Activity:</h3><p>${responseJson.activity}</p></li>
            <li><h3>Category:</h3><p class="category">${activityType.toLowerCase()}</p></li>
            <li><h3>No. of Participants:</h3><p>${responseJson.participants}</p></li>
            <li><h3>Price Indicator:</h3><p>${priceIndicator}</p></li>
        </ul>`
    );

    getYouTubeResults(responseJson.activity);
}

function getActivity(activityType,accessIndex){
    let baseUrl = "https://www.boredapi.com/api/activity";
    let url = "";

    if(activityType !== 'null' && accessIndex){
        url = baseUrl + '?type=' + activityType + '&minaccessibility=0&maxaccessibility=0.5';
    }else if(activityType !== 'null' && !accessIndex){
        url = baseUrl + '?type=' + activityType
    }else if(activityType === 'null' && accessIndex){
        url = baseUrl + '?minaccessibility=0&maxaccessibility=0.5';
    }else if(activityType === 'null' && !accessIndex){
        url = baseUrl;
    }

    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error(response.statusText);
        }
    })
    .then(responseJson => {
        displayActivity(responseJson);
    })
    .catch(error => console.log(error.message))
}

function handleFormSubmission(){
    $('#activity-form').on('submit', function(evt){
        let activityType = $('#activity-type').val();
        let accessIndex = $('#access-index').prop('checked');
        $('.youtube-results-list').empty();
        evt.preventDefault();
        getActivity(activityType,accessIndex);
    })
}

function trackResizing(){
    $(window).on('resize', function(){
        if(window.innerHeight < 250){
            $('.helpIcon').fadeOut();
        }
        if(window.innerHeight >= 250){
            $('.helpIcon').fadeIn();
        }
    });
}

function showHelpIcon(){
    $('.helpIcon').fadeTo(1000,1);
    displayHelp();
    trackResizing();
}

function closeHelpModal(){
    $('.help').on('click', '.helpCloseBtn, .close', function(){    
        $('.helpModal').fadeTo(1000,0, function(){
            $('.help').empty();
            showHelpIcon();
        })
    });
}

function displayHelp(){
    $('.helpIcon').on('click',function(){
        $('.helpIcon').fadeOut();
        $('.help').html(
            `<div id="infoModal" class="helpModal">
            <div class="helpModal-wrapper">
                <div class="helpModal-title">
                    <h2>Help</h2>
                    <span class="helpCloseBtn">&times;</span>
                </div>
                <div class="helpModal-content">
                    <dl>
                        <dt>Activity</dt>
                        <dd>Randomly generated activity.</dd>
                        <dt>Accessibility</dt>
                        <dd>Accessible Activities are based on a factor describing how possible an event is to do, with zero being the most accessible. This is set to a range of 0.0 - 2.0.
                        </dd>
                        <dt>Category</dt>
                        <dd>You can choose a specific category or go truly random. Category list: Education, Recreational, Social, Diy, Charity, Cooking, Relaxation, Music or Busywork.
                        </dd>
                        <dt>Participants</dt>
                        <dd>Recommended Number of participants for the activity.
                        </dd>
                        <dt>Price</dt>
                        <dd>Price is based on a factor describing the potential cost of the event, with zero being free. The range is from 0.0 - 1.0. This is not an exact science, but aims to be an indicator of the price obligiation for each activity.
                        </dd>
                        <dt>YouTube Videos</dt>
                        <dd>As each activity is generated, YouTube is searched for related videos based on the activity generated. The results of the YouTube search will be listed below the activity information. Clicking on the thumbnail will send you to YouTube to view the video.
                        </dd>
                    </dl>
                    <button type="button" class="close">Close</button>
                </div>
            </div>     
        </div>`);
        closeHelpModal();
    });
}

function closeIntroModal(){
    $('.intro').on('click', '.introCloseBtn, .close', function(){
        $('.introModal').fadeTo(1000,0, function(){
            $('.intro').empty();
            showHelpIcon();
        })
    });
}

function displayIntro(){
    $('.intro').html(`
        <div id="welcomModal" class="introModal">
            <div class="introModal-wrapper">
                <div class="introModal-title">
                    <h2>Welcome</h2>
                    <span class="introCloseBtn">&times;</span>
                </div>
                <div class="introModal-content">
                    <p>Hi there, I was created to help you with your boredom. Wait, what's that? You're not bored? Well I was also created to generate a random activity for you to do alone or with friends.</p>
                    <ol>
                        <li class="step">Step 1: Choose a category or go full random. You have eight categories from which to choose. I suggest random, but what do I know? I do as I am told.</li> 
                        <li class="step">Step 2: Decide if you would like for the activity to be "Accessible" or again, go fully random. If checked, I attempt to return activities that can be done by almost anyone. Now, I am not perfect (blame the person who programmed me), but I do my best.</li>  
                        <li class="step">Step 3: Click the generate random activity button. This is the fun part. A random activity is provided!! Well look at that. I am awesome aren't I? I also sent the activity to YouTube, since I am "connected", and well look at that! They sent back some videos related to the activity provided. How awesome are they? If you find that the videos aren't helpful, let me know and I will launch a formal complaint.</li>  
                        <li class="step">Step 4: Now this is the most important step. GO OUT AND ENJOY THE ACTIVITY!! I am just a bunch of 1s and 0s, so can't join you, but do enjoy.</li>    
                    </ol>
                    <p>Some things to note as I help you with generating activities.</p>
                    <ol class="notes">
                        <li>As I was intended to provide a random activity, so I made it so that you cannot alter the number of participants or change the price requirements. Maybe I will change that in the future.</li>
                        <li>If the activity suggests more participants than you have, feel free to get creative. For example: "Go to an escape room" suggests that four participants be involved. If you are alone or have fewer than four participants, you can take this opportunity to go to your favorite social media site and recruit others. Don't count it out just because you might not have the exact number of participants.</li>
                        <li>Lastly, the price indicator is there to give an indication of whether or not you might need money for the activity. This is a best guess and not an exact science.</li>
                    </ol>
                    <p>Do remember that each time you press the button, all of the previous information goes away never to return again. Just kidding, but it will go away until it is randomly generated again. Have fun!!</p>
                    <button type="button" class="close">Let's Get Started!</button>
                </div>
            </div>     
        </div>
    `);
    closeIntroModal();
}

function modalHandler(){
    displayIntro();
}

$(handleFormSubmission);
$(modalHandler);