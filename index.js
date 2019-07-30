function displayYouTubeResults(responseJson){
    for(let item in responseJson.items){
        $('.youtube-results-list').append(
            `<li class="youtube-result-item"><figure>
            <a href="https://www.youtube.com/watch?v=${responseJson.items[item].id.videoId}" target="_blank"><img src="${responseJson.items[item].snippet.thumbnails.high.url}" alt="${responseJson.items[item].snippet.title}" /></a>
            <figcaption>${responseJson.items[item].snippet.title}</figcaption>
            </figure></li>`
        );
    }
}

function getYouTubeResults(activity){
    activity = encodeURIComponent(activity);
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${activity}&maxResults=15&key=AIzaSyCZcPdtN3I4hj9M2U7FzW_OMZdVTWnNUhw`;

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
    $(`.activity-display`).html(
        `<p class="activity">Activity: ${responseJson.activity}</p>
         <p class="type">Activity Category: ${responseJson.type}</p>
         <p class="participants">Recommended No. of Participants: ${responseJson.participants}</p>
         <p class="price">Price Index: ${responseJson.price}</p>`
    );
    
    if(responseJson.link){
        $('.activity-display').append(`<p>${responseJson.link}</p>`);
    }

    getYouTubeResults(responseJson.activity);
}

function getActivity(activityType,accessIndex){
    let baseUrl = "https://www.boredapi.com/api/activity";
    let url = "";

    console.log(`activity=${activityType} & accessIndex=${accessIndex}`);

    if(activityType !== 'null' && accessIndex){
        url = baseUrl + '?type=' + activityType + '&minaccessibility=0&maxaccessibility=0.5';
    }else if(activityType !== 'null' && !accessIndex){
        url = baseUrl + '?type=' + activityType
    }else if(activityType === 'null' && accessIndex){
        url = baseUrl + '?minaccessibility=0&maxaccessibility=0.5';
    }else if(activityType === 'null' && !accessIndex){
        url = baseUrl;
    }

    console.log(url);
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
        let activityType = $('.activity-type').val();
        let accessIndex = $('#access-index').prop('checked');
        $('option:selected').prop('selected', false);
        $('#access-index').prop('checked', false);
        $('.youtube-results-list').empty();
        evt.preventDefault();
        getActivity(activityType,accessIndex);
    })
}

$(handleFormSubmission);