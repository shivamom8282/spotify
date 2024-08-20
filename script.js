let play=document.querySelector("#play")
let circle=document.querySelector(".circle")
let lineseek=document.querySelector(".lineseek")

let songs;

const currentsong= new Audio();

let ul = document.querySelector(".songs-ul");



function secondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

 
  const minutesFormatted = minutes.toString().padStart(2, '0');
  const secondsFormatted = remainingSeconds.toString().padStart(2, '0');

  return `${minutesFormatted}:${secondsFormatted}`;
}

const playMusic = (track) => {
  currentsong.src=track
  currentsong.play();
  document.querySelector(".songinfo").innerHTML=track.split('/').pop().split('.')[0].replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML="00:00"
};

function callSongs(e, fullPath) {
  ul.innerHTML += ` 
  <li data-track="${fullPath}">
    <div class="infopic">
       <img src="img/music.svg" alt="info-pic" />
       <div class="info">
          <div>${e}</div>
          <div>harry</div>
      </div>
    </div>
    <img  src="img/play.svg" alt="Play">
  </li>`;
}

async function main(folder) {

  let response = await fetch(`https://spotify-clone-copy.netlify.app/${folder}/`);
  let html = await response.text();
  let div = document.createElement("div");
  div.innerHTML = html;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const e = as[i];
    if (e.href.endsWith(".mp3")) {
      songs.push(e.href);
    }
  }
  
  document.querySelector(".songs-ul").innerHTML=""
  songs.forEach((songUrl) => {
    const songName = songUrl.split('/').pop().split('.')[0].replaceAll("%20", " ");
    callSongs(songName, songUrl);
  });

  document.querySelectorAll(".songs-ul li").forEach((li) => {
    li.addEventListener("click", (event) => {
      const track = event.currentTarget.getAttribute("data-track");
  
      playMusic(track);
        play.src="img/pause.svg"
    
    });
   
  
  });


  return songs;
}


async function folders()
{
  let response = await fetch(`https://spotify-clone-copy.netlify.app/songs/`);
  let html = await response.text();
  let div = document.createElement("div");
  div.innerHTML = html;

  let as=div.getElementsByTagName("a")
  let cardContainer=document.querySelector(".card-container")

  let array=Array.from(as)
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if(e.href.includes("/songs/"))
    {
      let folder=(e.href.split("/").slice(-2)[1])    
    let response = await fetch(`https://spotify-clone-copy.netlify.app/songs/${folder}/info.json`);
      let html = await response.json();
 
      cardContainer.innerHTML += ` <div data-folder=${folder} class="card ">
                    <div class="play-btn">
                        <svg class="pl-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="black">
                          <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                      </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    <h2>${html.title}</h2>
                    <p>${html.description}</p>
                </div> `
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e)=>{

    e.addEventListener("click", async e => {
     
      songs=await main(`songs/${e.currentTarget.dataset.folder}`)
      playMusic(songs[0])
        play.src="img/pause.svg"

  
  });}) 
}
async function main1() {
  songs = await main(`songs/ncs`);
  folders()
   currentsong.src= songs[1];

   document.querySelector("#prvsplay").addEventListener("click", (e) => {
    let currentIndex = songs.indexOf(currentsong.src);
    
    if (currentIndex > 0) {
      playMusic(songs[currentIndex - 1]);
      play.src="img/pause.svg"
    } else {
      playMusic(songs[songs.length - 1]); 
      play.src="img/pause.svg"
    }
  });
  
  document.querySelector("#nxtplay").addEventListener("click", () => {
    let currentIndex = songs.indexOf(currentsong.src);
    if (currentIndex < songs.length - 1) {
      playMusic(songs[currentIndex + 1]);
      play.src="img/pause.svg"
    } else {
      playMusic(songs[0]);
      play.src="img/pause.svg"
    }
    
    

   
  });
       
     
  




  // Array.from(document.querySelectorAll(".songs-ul li")).forEach((e) => {
  //   console.log(e.querySelector(".info").firstElementChild.innerHTML);
  // });


  play.addEventListener("click",(e)=>
  {
    if(currentsong.paused)
    {
      currentsong.play(songs[1])
    
   
      play.src="img/pause.svg"

    }
    else
    {
      currentsong.pause()
         
 
      play.src="img/play.svg"
    
    }
  })

    currentsong.addEventListener("timeupdate",()=>
    {

      document.querySelector(".songtime").innerHTML=`${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`
      circle.style.left=`${(currentsong.currentTime/currentsong.duration) *100}`+"%";
      lineseek.style.width=`${(currentsong.currentTime/currentsong.duration) *100}`+"%";
      // circle.style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
      if (Math.abs(currentsong.currentTime - currentsong.duration) < 0.1) {
        let currentIndex = songs.indexOf(currentsong.src);
        if (currentIndex < songs.length - 1) {
          playMusic(songs[currentIndex + 1]);
        } 
        play.src = "img/pause.svg";
      }

    })

    

    //  document.querySelector(".seekbar").addEventListener("click",(e)=>
    // {
    //   circle.style.left=(e.currentTarget.offsetX/e.target.getBoundingClientRect().width)*100+"%";
    //   lineseek.style.width=(e.currentTarget.offsetX/e.target.getBoundingClientRect().width)*100+"%";
    //  currentsong.currentTime=((currentsong.duration)*(e.offsetX/e.target.getBoundingClientRect().width)*100)/100;

    // })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
      const seekbar = e.currentTarget;
      const rect = seekbar.getBoundingClientRect(); // Get the size and position of the seekbar
      const offsetX = e.clientX - rect.left; // Calculate the click position relative to the seekbar
    
      const seekPercent = (offsetX / rect.width) * 100;
    
      document.querySelector(".circle").style.left = seekPercent + "%";
      document.querySelector(".lineseek").style.width = seekPercent + "%";
      
      currentsong.currentTime = (currentsong.duration * seekPercent) / 100;
    });
    
    document.querySelector(".vol").addEventListener("change",(e)=>
    {

      currentsong.volume=parseInt(e.target.value)/100 
      document.querySelector(".volimg").src="img/volume.svg"
      if(e.target.value==0)
      {

        document.querySelector(".volimg").src="img/novolume.svg"
      }
    })


    document.querySelector(".volimg").addEventListener("click", () => {
      let speaker = document.querySelector(".volimg");
      let voiceval=document.querySelector(".vol")
    
      if (speaker.src.includes("img/novolume.svg")) {
        speaker.src = "img/volume.svg";
        voiceval.value=30
        currentsong.volume=parseInt(voiceval.value)/100 
        
      } else {
       
        speaker.src = "img/novolume.svg";
        voiceval.value=0
        currentsong.volume=parseInt(voiceval.value)/100 
      }
    });
    
    
 

}

main1();


let left=document.querySelector(".left")
let hamburger=document.querySelector(".ham")
let cross=document.querySelector(".cross")
hamburger.addEventListener("click",()=>
{
  left.style.left="0%"
})
cross.addEventListener("click",()=>
{
  left.style.left="-100%"
})




