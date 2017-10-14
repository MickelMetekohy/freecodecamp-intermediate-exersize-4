const sources = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
const results = [];
const streaming = [];
const offline = [];

// sort the streaming and offline array
const sortResults = function() {
  function compare(a,b) {
    const x = a.source.toLowerCase();
    const z = b.source.toLowerCase();
    if (x < z) {return -1;}
    if (x > z) {return 1;}
    return 0;
  }
  offline.sort(compare);
  streaming.sort(compare);
}

// render the results to the <main> tag
const renderResults = function() {
  const mainContainer = document.querySelector('main');
  streaming.forEach(function(val) {
    mainContainer.innerHTML += `
      <ul class="table-row streaming">
        <li class="table-data source"><a target="_blank" href="${val.stream.channel.url}">${val.source}</a></li>
        <li class="table-data game"><a target="_blank" href="${val.stream.channel.url}">${val.stream.game}</a></li>
        <li class="table-data viewers"><a target="_blank" href="${val.stream.channel.url}">${val.stream.viewers}</a></li>
        <li class="table-data status"><a target="_blank" href="${val.stream.channel.url}">${val.stream.channel.status}</a></li>
      </ul>
    `;
  });
  offline.map(function(val) {
    mainContainer.innerHTML += `
      <ul class="table-row offline">
        <li class="table-data source"><a target="_blank" href="https://www.twitch.tv/${val.source}">${val.source}</a></li>
        <li class="table-data offline"><a target="_blank" href="https://www.twitch.tv/${val.source}">OFFLINE</a></li>
      </ul>
    `;
  });
}

// https://api.twitch.tv/kraken/streams/
// https://wind-bow.gomix.me/twitch-api
const getTwitchStream = function(s, cb) {
  $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/'+s+'?callback=?')
    .done(function(data) {
      data.source = s;
      results.push(data);
      (data.stream) ? streaming.push(data) : offline.push(data);
    })
    .fail(function( jqxhr, textStatus, error ) {
      let err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    })
    .always(function(data) {
      cb();
    });
}

const init = function() {
  // get the data
  let requests = sources.map((val) => {
    return new Promise((resolve) => {
      getTwitchStream(val, resolve);
    });
  });

  Promise.all(requests).then(() => {
    sortResults();
    renderResults()
  });
}

// Get the ball rolling
init();
