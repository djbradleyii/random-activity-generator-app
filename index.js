// v1.0.1 Add error handler function to provide
// more useful error messages

$(document).ready(function () {
  $(".error-msg").hide();
  $(".load-msg").hide();
});

function displayYouTubeResults(responseJson) {
  for (let item in responseJson.items) {
    let videoLink = "";
    let videoTitle = responseJson.items[item].snippet.title;

    //handles videoId returning undefined
    if (responseJson.items[item].id.videoId) {
      videoLink = `https://www.youtube.com/watch?v=${responseJson.items[item].id.videoId}`;
    } else {
      videoLink = `https://www.youtube.com/channel/${responseJson.items[item].snippet.channelId}`;
    }

    $(".youtube-results-list").append(
      `<li class="youtube-result-item"><figure>
            <a href="${videoLink}" target="_blank"><img src="${
        responseJson.items[item].snippet.thumbnails.high.url
      }" alt="${responseJson.items[item].snippet.title}" /></a>
            <figcaption>${videoTitle.toLowerCase()}</figcaption>
            </figure></li>`
    );
  }
}

function getYouTubeResults(activity) {
  activity = encodeURIComponent(activity);
  let url = `https://random-activity-app-proxy.onrender.com/activity?q=${activity}`;
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => {
      displayYouTubeResults(responseJson);
      $(".error-msg").hide();
      $(".load-msg").hide();
    })
    .catch((error) => {
      $(".error-msg").show().text(`Something went wrong: ${error.message}`);
    });
}

function displayActivity(responseJson) {
  let priceIndicator = "";
  let activityType = responseJson.type;

  if (responseJson.price === 0) {
    priceIndicator = "Possibly Free";
  } else if (responseJson.price > 0 && responseJson.price < 0.5) {
    priceIndicator = "Potential Charge";
  } else if (responseJson.price > 0.5) {
    priceIndicator = "Go to ATM";
  }

  $(`.activity-display`).html(
    `<ul>
            <li><h3>Activity:</h3><p>${responseJson.activity}</p></li>
            <li><h3>Category:</h3><p class="category">${activityType.toLowerCase()}</p></li>
            <li><h3>No. of Participants:</h3><p>${
              responseJson.participants
            }</p></li>
            <li><h3>Price Indicator:</h3><p>${priceIndicator}</p></li>
        </ul>`
  );

  getYouTubeResults(responseJson.activity);
}

function getActivity(activityType, accessIndex) {
  let baseUrl = "https://www.boredapi.com/api/activity";
  let url = "";

  if (activityType !== "null" && accessIndex) {
    url =
      baseUrl +
      "?type=" +
      activityType +
      "&minaccessibility=0&maxaccessibility=0.5";
  } else if (activityType !== "null" && !accessIndex) {
    url = baseUrl + "?type=" + activityType;
  } else if (activityType === "null" && accessIndex) {
    url = baseUrl + "?minaccessibility=0&maxaccessibility=0.5";
  } else if (activityType === "null" && !accessIndex) {
    url = baseUrl;
  }

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => {
      displayActivity(responseJson);
      $(".error-msg").hide();
      $(".load-msg").show().text(`Loading YouTube Videos...`);
    })
    .catch((error) => {
      $(".load-msg").hide();
      $(".error-msg").show().text(`Something went wrong: ${error.message}`);
    });
}

function handleFormSubmission() {
  $("#activity-form").on("submit", function (evt) {
    $(".error-msg").hide();
    $(".load-msg").show().text(`Loading Activity & YouTube Videos...`);
    let activityType = $("#activity-type").val();
    let accessIndex = $("#access-index").prop("checked");
    $(".youtube-results-list").empty();
    evt.preventDefault();
    getActivity(activityType, accessIndex);
  });
}

function closeHelpModal() {
  $(".help").on("click", ".helpCloseBtn, .close", function () {
    $(".helpModal").fadeTo(1000, 0, function () {
      $(".help").empty();
      showHelpIcon();
    });
  });
}

function displayHelp() {
  showHelpIcon();
  $(".helpIcon").on("click", function () {
    hideHelpIcon();
    $(".help").html(
      `<div id="infoModal" class="helpModal">
            <div class="helpModal-wrapper">
                <div class="helpModal-title">
                    <h2>Help</h2>
                    <button class="helpCloseBtn">&times;</button>
                </div>
                <div class="helpModal-content">
                    <dl>
                        <dt>Activity</dt>
                        <dd>Randomly generated activity.</dd>
                        <dt>Accessibility</dt>
                        <dd>Accessible Activities are based on a factor describing how possible an event is to do, with zero being the most accessible. This is set to a range of 0.0 - 1.0.
                        </dd>
                        <dt>Category</dt>
                        <dd>You can choose a specific category or go truly random. Category list: Education, Recreational, Social, Diy, Charity, Cooking, Relaxation, Music or Busywork.
                        </dd>
                        <dt>Participants</dt>
                        <dd>Recommended Number of participants for the activity.
                        </dd>
                        <dt>Price</dt>
                        <dd>Price indicator is based on a factor describing the potential cost of the event, with zero being free. The range is from 0.0 - 1.0. This is not an exact science, but aims to be an indicator of the price obligation for each activity.
                        </dd>
                        <dt>YouTube Videos</dt>
                        <dd>As each activity is generated, YouTube is searched for related videos based on the activity generated. The results of the YouTube search will be listed below the activity information. Clicking on the thumbnail will send you to YouTube to view the video or the YouTube channel.
                        </dd>
                    </dl>
                    <p>Some things to note as I help you with generating activities.</p>
                    <ol class="notes">
                        <li>As I was intended to provide a random activity, I made it so that you cannot alter the number of participants or change the price requirements. Maybe I will change that in the future.</li>
                        <li>If the activity suggests more participants than you have, feel free to get creative. For example: "Go to an escape room" suggests that four participants be involved. If you are alone or have fewer than four participants, you can take this opportunity to catch up with friends or team-build with your coworkers.</li>
                        <li>Try not to discard the activity just because you might not have the exact number of participants.</li>
                        <li>Lastly, the price indicator is there to give an indication of whether or not you might need money for the activity. This is a best guess and not an exact science.</li>
                    </ol>
                    <p>Do remember that each time you press the button, all of the previous information goes away never to return again. Just kidding, but it will go away until it is randomly generated again. Have fun!</p>
                    <button type="button" class="close">Close</button>
                </div>
            </div>     
        </div>`
    );
    closeHelpModal();
  });
}

function hideHelpIcon() {
  $(".helpIcon").fadeOut();
}

function showHelpIcon() {
  $(".helpIcon").fadeIn();
}

function closeIntroModal() {
  $(".intro").on("click", ".introCloseBtn, .close", function () {
    $(".introModal").fadeTo(1000, 0, function () {
      $(".intro").empty();
      displayHelp();
    });
  });
}

function displayIntro() {
  $(".intro").html(`
        <div id="welcomModal" class="introModal">
            <div class="introModal-wrapper">
                <div class="introModal-title">
                    <h2>Welcome</h2>
                    <button class="introCloseBtn">&times;</botton>
                </div>
                <div class="introModal-content">
                    <p>Hi there! Are you bored out of your mind? I was created to help you with just that. Wait, what's that? You're not bored? Well, I am here to give you a random activity to do alone or with friends, regardless.</p>
                    <ol>
                        <li class="step"><span>Step 1:</span> Choose a category or go full random. You have 8 categories from which to choose (choose wisely or don't). You can also select 'Accessible' activities, which is my attempt at returning activities that can be done by almost anyone, but I am not perfect (blame the person who programmed me), but I do my best.</li> 
                        <li class="step"><span>Step 2:</span> Now the fun part. Click the 'Generate Activity' button and BOOM! A random activity at your fingertips. I'm awesome, aren't I? I also sent the activity to YouTube, since I am "connected", and well look at that! They sent back some videos related to the activity I provided. How awesome are they? If you find that the videos aren't helpful, let me know and I will launch a formal complaint with them.</li>  
                        <li class="step"><span>Step 3:</span> Now, the most important step: GO OUT AND ENJOY THE ACTIVITY! I am just a bunch of 1s and 0s, so I can't join you, but do have all the fun!</li>  
                    </ol>
                    <p>Please note: Due to quota restrictions the number of video results has been limited to 4 per submission.</p>
                    <button type="button" class="close">Let's Get Started!</button>
                </div>
            </div>     
        </div>
    `);
  closeIntroModal();
}

function modalHandler() {
  displayIntro();
}

$(handleFormSubmission);
$(modalHandler);
