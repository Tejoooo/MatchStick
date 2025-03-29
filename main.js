document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const ageinput = document.getElementById("ageInput")
    const storeAgeButton = document.getElementById("storeage");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let userAddcandles=0;
  
    function showAlert(message,playsong=false) {
        const alertBox = document.getElementById("customAlert");
        const alertMessage = document.getElementById("alertMessage");
        alertMessage.textContent = message;
        alertBox.style.display = "block";

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-US"; // Set language (change as needed)
        speech.rate = 1; // Adjust speed (default is 1)
        speech.pitch = 1; // Adjust pitch (default is 1)
        if(!playsong) window.speechSynthesis.speak(speech);
       

        document.getElementById("closeAlert").onclick = function () {
            alertBox.style.display = "none";
        };
    }
    
    


    storeAgeButton.addEventListener("click", function () {
        const ageValue = parseInt(ageinput.value, 10);

        if (!isNaN(ageValue) && ageValue > 0) {
            userAge = ageValue;
            userAddcandles = 0; // Reset candle count
            candles = []; // Clear previous candles
            showAlert("Age stored successfully: " + userAge + "\nPlease Add the candles !!");

        } else {
            alert("Please enter a valid age!");
        }
    });

    function updateCandleCount() {
      const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
      if (activeCandles === 0 && candles.length > 0) {
        setTimeout(() => {
            showAlert("Happy Birthday",true);
            const audio = new Audio("bday.mp3"); // Use a direct URL
            audio.play();
        }, 500); // Small delay for effect
    }
    }
  
    function addCandle(left, top) {
      if (userAddcandles >= parseInt(ageinput.value, 10)) {
        return; 
    }
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";
  
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
  
      cake.appendChild(candle);
      candles.push(candle);
      userAddcandles++;
      updateCandleCount();
      console.log(userAddcandles)
      console.log(ageinput.value)
      if (userAddcandles === parseInt(ageinput.value,10)) {
        console.log("entered")
        setTimeout(() => {
            showAlert("Please blow the candles!",true);
        }, 500);
    }
    }
  
    cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });
  
    function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;
  
      return average > 40; //
    }
  
    function blowOutCandles() {
      let blownOut = 0;
  
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }
  
      if (blownOut > 0) {
        updateCandleCount();
      }
    }
  
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  });
  