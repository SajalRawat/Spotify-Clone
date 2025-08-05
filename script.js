let currentSong = new Audio()
currentSong.volume = 1
let currentFolder

async function getSongs(folder) {
    let a = await fetch(`${folder}/`)
    currentFolder = folder
    let response = await (a.text())
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songList = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songList.push(element.href)

        }

    }
    return songList
}

function secToMinSec(rawSec) {
    function toTwoDigit(i) {
        if (i.toString().length == 1) {
            return (`0${i}`)
        }
        else { return i }
    }
    let min = Math.floor(rawSec / 60)
    let sec = (Math.round((rawSec - (min * 60))))

    return (` ${toTwoDigit(min)}:${toTwoDigit(sec)}`)


}



function playTrack(track) {
    currentSong.src = track
    let songName = ((track.split(`/${currentFolder}/`)[1]).replaceAll("%20", " ")).replaceAll("mp3", "")

    currentSong.play()
    document.querySelector('.playbar').classList.add("hidden")
    play.src = "pause.svg"

    document.querySelector(".songinfo").innerHTML = songName
    document.querySelector(".songtime").innerHTML = "00:00"

}


async function main() {
    let songList

    async function trackDisplay(folder) {
        songList = null
        songsUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
        songsUL.innerHTML = ""
        songs = await getSongs(folder)
        songList = songs





        for (const element of songs) {
            songName = ((element.split(`/${currentFolder}/`)[1]).replaceAll("%20", " ")).replaceAll("mp3", "")
            songsUL.innerHTML = songsUL.innerHTML + `
        <li data-src="${element}">
                        <div class="musicInfo">
                            <svg xmlns="http://www.w3.org/2000/svg" class="invert" viewBox="0 0 24 24" width="24"
                                height="24" color="#000000" fill="none">
                                <circle cx="6.5" cy="18.5" r="3.5" stroke="#141B34" stroke-width="1.5" />
                                <circle cx="18" cy="16" r="3" stroke="#141B34" stroke-width="1.5" />
                                <path
                                    d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16"
                                    stroke="#141B34" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="#141B34" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div class="songInfo">
                                <div class="songName">${songName}</div>
                                <div class="songArtist">Sajal Rawat</div>
                            </div>
                        </div>
                        <div class="playNow">
                            <p>Play Now</p>
                            <img src="play.svg" class="invert" width="20px" alt="">
                        </div>
                    </li>`

        }
        let trackList = songsUL.querySelectorAll("li")
        for (let li of trackList) {
            li.addEventListener("click", () => {
                playTrack(li.dataset.src)
            })
        }
        playTrack(trackList[0].dataset.src)
        document.querySelector(".left").style.left = 0
    }




    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = (`${secToMinSec(currentSong.currentTime)}/${secToMinSec(currentSong.duration)}`)
        let currentProgress = ((currentSong.currentTime / currentSong.duration) * 100)
        document.querySelector(".circle").setAttribute("style", `left:${currentProgress}%`)
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let currentProgress = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        currentSong.currentTime = ((currentProgress/100)*currentSong.duration)
        document.querySelector(".circle").setAttribute("style", `left:${currentProgress}%`)
        
        


    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0

    })
    document.querySelector(".closeHamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100vw"

    })
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }

        else {
            play.src = "play.svg"
            currentSong.pause()
        }
    })



    document.body.querySelector(".volume").addEventListener("change", (e) => {
        volume = e.target.value
        currentSong.volume = (volume / 100)
        if (volume==0){
            document.querySelector(".volumeDiv").getElementsByTagName("img")[0].src = "volumeMute.svg"
        }
        if (volume!=0){
            document.querySelector(".volumeDiv").getElementsByTagName("img")[0].src = "volume.svg"

        }


    })
    // adding event listener to volume icon
    document.querySelector(".volumeDiv").getElementsByTagName("img")[0].addEventListener("click", (e) => {
        if (currentSong.volume!=0){
            e.target.src = "volumeMute.svg"
            currentSong.volume =0
            document.body.querySelector(".volumeDiv").getElementsByTagName("input")[0].value =0

        }
        else if (currentSong.volume==0){
            e.target.src = "volume.svg"
            currentSong.volume =0.5
            document.body.querySelector(".volumeDiv").getElementsByTagName("input")[0].value = 50

        }
        
        
    })

    document.body.addEventListener("keydown", (e) => {
        if (e.key == "p") {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "pause.svg"
            }

            else {
                play.src = "play.svg"
                currentSong.pause()
            }
        }
    })
    prev.addEventListener("click", () => {
        let index
        if (currentSong.src != "") {
            index = songList.indexOf(currentSong.src)


        }
        if ((index - 1) >= 0) {
            playTrack(songList[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index
        if (currentSong.src != "") {
            index = songList.indexOf(currentSong.src)


        }
        if ((index + 1) < (songList.length)) {
            playTrack(songList[index + 1])
        }
    })


    async function displayAlbums() {
        let a = await fetch(`/songs/`)
        let response = await (a.text())
        let div = document.createElement("div")
        div.innerHTML = response
        all = div.getElementsByTagName("a")


        // NOTE - Damnnn dont use .foreach in async as it runs parallel not sequentially


        allArr = Array.from(all)

        for (let index = 0; index < allArr.length; index++) {
            const e = allArr[index];
            if (e.href.includes("/songs/")) {
                folder = (e.href.split("/songs/")[1].replaceAll("/", ""))

                let a = await fetch(`${e.href}info.json/`)
                let response = await (a.json())
                let cardContainer = document.querySelector(".cardContainer")
                cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card m-1 " data-folder="songs/${folder}">
                    <div class="play">


                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="44" height="44">
                            <!-- Spotify Green filled circle -->
                            <circle cx="12" cy="12" r="10" fill="#1DB954" />

                            <!-- Black circle outline
  <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5" fill="none" /> -->

                            <!-- Black play-style path -->
                            <path
                                d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                fill="#000000" />
                        </svg>



                    </div>
                    <img aria-hidden="false" draggable="false" loading="lazy"
                        src="${e.href}cover.jpg" data-testid="card-image"
                        alt=""
                        class="mMx2LUixlnN_Fu45JpFB yMQTWVwLJ5bV8VGiaqU3 yOKoknIYYzAE90pe7_SE Yn2Ei5QZn19gria6LjZj">
                    <h2>${response.title}</h2>
                    <p>${response.Description}</p>
                </div>   
`
            }

        }


        Array.from(document.querySelectorAll(".card")).forEach((element) => {
            element.addEventListener("click", () => {
                trackDisplay(element.dataset.folder)

            })
        })
    }
    displayAlbums()
}
main()




