let days, weeks, years;
let database;

// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();  

// Open request for Firebase config. Asynchronous is false.  
xhr.open('GET', 'config.json', false); 

// Send the request
xhr.send();  

// Check the status of the request
if (xhr.status === 200) {  
  const config = JSON.parse(xhr.responseText);

  // Initialize Firebase with the configuration object
  firebase.initializeApp(config);  
  // Access the Firebase database here
  database = firebase.database();  
}

document.querySelectorAll('.counter-block').forEach(counter => {
  counter.classList.add('anime-counter');
});

const updateData = (element, val, unit) => {
  database.ref(unit).set(val);
  element.innerHTML = val;
}

/***************************************************
 * Individual Salat Counters */

// Get current individual salat counts
let daySalatArr = database.ref('salawat');
daySalatArr.once('value', function(snapshot) {
  if (!snapshot.val()) {
    database.ref("salawat").set([0,0,0,0,0]);
  }
  
  daySalatArr = snapshot.val();
  updateSalawat();
});

// Update salawat counter UI
const updateSalawat = () => {
  try {
    database.ref("salawat").set(daySalatArr);
  } catch (error) {
    console.log('Error:', error);
  }
  displayFajr.innerHTML   = daySalatArr[0];
  displayDhuhr.innerHTML  = daySalatArr[1];
  displayAsr.innerHTML    = daySalatArr[2];
  displayMaghrib.innerHTML= daySalatArr[3];
  displayIshaa.innerHTML  = daySalatArr[4];
}

// Fajr HTML elements
const btnIncrFajr = document.getElementById("btnIncrFajr");
const btnDecrFajr = document.getElementById("btnDecrFajr");
const displayFajr = document.querySelector("#displayFajr .value");

// Dhuhr HTML elements
const btnIncrDhuhr = document.getElementById("btnIncrDhuhr");
const btnDecrDhuhr = document.getElementById("btnDecrDhuhr");
const displayDhuhr = document.querySelector("#displayDhuhr .value");

// Asr HTML elements
const btnIncrAsr = document.getElementById("btnIncrAsr");
const btnDecrAsr = document.getElementById("btnDecrAsr");
const displayAsr = document.querySelector("#displayAsr .value");

// Maghrib HTML elements
const btnIncrMaghrib = document.getElementById("btnIncrMaghrib");
const btnDecrMaghrib = document.getElementById("btnDecrMaghrib");
const displayMaghrib = document.querySelector("#displayMaghrib .value");

// Ishaa HTML elements
const btnIncrIshaa = document.getElementById("btnIncrIshaa");
const btnDecrIshaa = document.getElementById("btnDecrIshaa");
const displayIshaa = document.querySelector("#displayIshaa .value");

const incrementSalat = (index) => {
  // Isolate the rest of array items from the item
  const restArr = daySalatArr.slice();
  restArr.splice(index, 1);

  // If array item exists
  if (daySalatArr[index] >= 0) {
  /** If the item is equal to 0 and the rest of the array is larger than 0,
      increment days then decrement all items by 1. */  
    if (daySalatArr[index] < 1 && restArr.every( salatitem => salatitem > 0)) {
      daySalatArr[index]++;
      daySalatArr.forEach((item, i) => daySalatArr[i]--);
      incrementDays();
    } else {
      daySalatArr[index]++;
    }
  }
  updateSalawat();
}

const decrementSalat = (index) => {
  // Isolate the rest of array items from the item
  const restArr = daySalatArr.slice();
  restArr.splice(index, 1);

  // If array item exists
  if (daySalatArr[index] >= 0) {
  /** If the item is equal to 0,
      increment all array items by 1 then decrement item and decrement days. */  
    if (daySalatArr[index] < 1) {
      daySalatArr.forEach((item, i) => daySalatArr[i]++);
      decrementDays();
      daySalatArr[index]--;
    } else {
      daySalatArr[index]--;
    }
  }
  updateSalawat();
}

btnIncrFajr.addEventListener("click",   e => { incrementSalat(0); });
btnIncrDhuhr.addEventListener("click",  e => { incrementSalat(1); });
btnIncrAsr.addEventListener("click",    e => { incrementSalat(2); });
btnIncrMaghrib.addEventListener("click",e => { incrementSalat(3); });
btnIncrIshaa.addEventListener("click",  e => { incrementSalat(4); });

btnDecrFajr.addEventListener("click",   e => { decrementSalat(0); });
btnDecrDhuhr.addEventListener("click",  e => { decrementSalat(1); });
btnDecrAsr.addEventListener("click",    e => { decrementSalat(2); });
btnDecrMaghrib.addEventListener("click",e => { decrementSalat(3); });
btnDecrIshaa.addEventListener("click",  e => { decrementSalat(4); });

/***************************************************
 * Days Counter */

// Get days HTML elements and functions
const btnIncrDays = document.getElementById("btnIncrDays");
const btnDecrDays = document.getElementById("btnDecrDays");
const displayDays = document.querySelector("#displayDays .value");

const incrementDays = () => {
  if (days < 6) {
    days++;
  } else {
    days = 0;
    incrementWeeks();
  }
  updateData(displayDays, days, "days");
}

const decrementDays = () => {
  if (days > 0) {
    days--;
  } else {
    days = 6;
    decrementWeeks();
  }  
  updateData(displayDays, days, "days");
}

// Retrieve the current value of days from Firebase
let daysRef = database.ref('days');
daysRef.once('value', function(snapshot) {
  if (!snapshot.val()) {
    database.ref("days").set(0);
  }
  
  days = snapshot.val();
  updateData(displayDays, days, "days");
});

btnIncrDays.addEventListener("click", e => {
  const resp = confirm("Add 1 day?");
  if (resp) {
    incrementDays();
  }
});

btnDecrDays.addEventListener("click", e => {
  const resp = confirm("Subtract 1 day?");
  if (resp) {
    decrementDays();
  }
});

/***************************************************
 * Weeks Counter */

// Get weeks HTML elements and functions
const btnIncrWeeks = document.getElementById("btnIncrWeeks");
const btnDecrWeeks = document.getElementById("btnDecrWeeks");
const displayWeeks = document.querySelector("#displayWeeks .value");

const incrementWeeks = () => {
  if (weeks < 51) {
    weeks++;
  } else {
    weeks = 0;
    incrementYears();
  }
  updateData(displayWeeks, weeks, "weeks");
}

const decrementWeeks = () => {
  if (weeks > 0) {
    weeks--;
  } else {
    weeks = 51;
    decrementYears();
  }
  updateData(displayWeeks, weeks, "weeks");
}

// Retrieve the current value of weeks from Firebase
let weeksRef = database.ref('weeks');
weeksRef.once('value', function(snapshot) {
  if (!snapshot.val()) {
    database.ref("weeks").set(0);
  }
  
  weeks = snapshot.val();
  updateData(displayWeeks, weeks, "weeks");
});

btnIncrWeeks.addEventListener("click", e => {
  const resp = confirm("Add 1 week?");
  if (resp) {
    incrementWeeks();
  }
});
btnDecrWeeks.addEventListener("click", e => {
  const resp = confirm("Subtract 1 week?");
  if (resp) {
    decrementWeeks();
  }
});

/***************************************************
 * Years Counter */

// Get years HTML elements and functions
const btnIncrYears = document.getElementById("btnIncrYears");
const btnDecrYears = document.getElementById("btnDecrYears");
const displayYears = document.querySelector("#displayYears .value");

const incrementYears = () => {
  years++;
  updateData(displayYears, years, "years");
}

const decrementYears = () => {
  years--;
  updateData(displayYears, years, "years");
}

// Retrieve the current value of years from Firebase
let yearsRef = database.ref('years');
yearsRef.once('value', function(snapshot) {
  if (!snapshot.val()) {
    database.ref("years").set(0);
  }
  
  years = snapshot.val();
  updateData(displayYears, years, "years");
});

btnIncrYears.addEventListener("click", e => {
  const resp = confirm("Add 1 year?");
  if (resp) {
    incrementYears();
  }
});
btnDecrYears.addEventListener("click", e => {
  const resp = confirm("Subtract 1 year?");
  if (resp) {
    decrementYears();
  }
});
