function issMove(map, marker, coords) {
  let LatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
  document.getElementById(
    "location"
  ).innerHTML = `latitude: ${coords.latitude}, longitude: ${coords.longitude} `;
  marker.setPosition(LatLng);
  map.panTo(LatLng, (animate = true));
}

function api(url) {
  return fetch(url)
    .then(data => {
      return data.json();
    })
    .then(res => {
      return res;
    });
}

function peoplesOnIss(peoples) {
  document.getElementById("people").innerHTML = "";
  let amount = 0;
  peoples.map(person => {
    if (person.craft === "ISS") {
      let div = document.createElement("div");
      div.className = "person";
      div.innerHTML = `<div class="avatar"><img src="./img/user.png" alt="" />  </div><div class="info"><p>${
        person.name
      }</p><p>${moment().format(" HH:mm:ss ")}</p></div>`;
      document.getElementById("people").append(div);
      amount++;
    }
  });
  document.getElementById("amount").innerHTML = `Total amount ${amount} on ISS`;
}

window.onload = async () => {
  //initial state
  let coords = await api("http://api.open-notify.org/iss-now.json");
  let peoples = await api("http://api.open-notify.org/astros.json");
  document.getElementById("time").innerHTML = `${moment().format(
    "DD/MM/YYYY, HH:mm:ss Z"
  )}`;
  peoplesOnIss(peoples.people);

  //map initializing
  const issCoord = {
    lat: parseInt(coords.iss_position.latitude),
    lng: parseInt(coords.iss_position.longitude)
  };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: issCoord,
    mapTypeId: "satellite"
  });

  const marker = new google.maps.Marker({
    position: issCoord,
    map: map,
    icon: "../img/ISSIcon.png",
    title: "ISS"
  });
  //end map initializing

  (async function updater() {
    //update state
    coords = await api("http://api.open-notify.org/iss-now.json");
    peoples = await api("http://api.open-notify.org/astros.json");
    //update map
    issMove(map, marker, coords.iss_position);
    peoplesOnIss(peoples.people);

    //update date
    //date by defaul js Date func
    // const date = new Date();
    // document.getElementById(
    //   "time"
    // ).innerHTML = `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()} - ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

    //date with momentjs libs
    document.getElementById("time").innerHTML = `${moment().format(
      "DD/MM/YYYY, HH:mm:ss Z"
    )}`;

    //recursive call updater
    setTimeout(updater, 5000);
  })();
};
