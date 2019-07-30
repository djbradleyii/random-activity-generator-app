function displayYouTubeResults(){
    // this function will display youtube results
    console.log('displayYouTubeResults ran');

}

function getYouTubeResults(){
    // this function will get youtube results
    console.log('getYouTubeResults ran');
}

function displayActivity(responseJson){
    //this function will display the activity to the DOM
    console.log(`displayActivity ran`);

    $(`.activity-display`).html(
        `<p class="activity">Activity: ${responseJson.activity}</p>
         <p class="type">Activity Category: ${responseJson.type}</p>
         <p class="participants">Recommended No. of Participants: ${responseJson.participants}</p>
         <p class="price">Price Index: ${responseJson.price}</p>`
    );
    
    if(responseJson.link){
        $(`.activity-display`).append(`<p>${responseJson.link}</p>`);
    }

    getYouTubeResults(responseJson.activity);
}

function getActivity(activityType){
    //this function will get the activity
    console.log(`getActivity ran`);
    let baseUrl = "https://www.boredapi.com/api/activity";
    let url = "";
    
    if(activityType !== 'null'){
        url = baseUrl + '?type=' + activityType;
    }else{
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
// this function will handle the form submission
console.log(`handleFormSubmission ran`);

$('#activity-form').on('submit', function(evt){
    let activityType = $('.activity-type').val();
    $("option:selected").prop("selected", false);
    evt.preventDefault();
    getActivity(activityType);
})
}

$(handleFormSubmission);