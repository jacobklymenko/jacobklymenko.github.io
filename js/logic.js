loadJSON()

async function loadJSON() { 
    data = await askForData()

    for (let index = 0; index < data.length; index++) {

        profileContainer = document.createElement("div")
        profileContainer.classList.add("profile_container")
        
        imageWrapper = document.createElement("div")
        imageWrapper.classList.add("img_wrapper")
        
        profileImage = document.createElement("img")
        profileImage.classList.add("profile_image")
        profileImage.id = data[index]["Name"]
        profileImage.src = data[index]["Image"]

        profileImage.addEventListener("click", function() {getProfileInfo(index)})

        profileTextNode = document.createTextNode(data[index]["Name"])
        profileName = document.createElement("div")
        profileName.classList.add("profile_name")
        profileName.appendChild(profileTextNode)

        imageWrapper.appendChild(profileImage)
        profileContainer.appendChild(imageWrapper)
        imageWrapper.appendChild(profileName)
        
        document.getElementById("profiles_container").appendChild(profileContainer)
    }
}

async function askForData() {
    let res = await fetch("./information.json");
    return res.json()
  }

async function getProfileInfo(index) {
    // update the player's name
    document.getElementById("name").innerHTML = data[index]["Name"]

    // update the player's image and biography
    document.getElementById("image").src = data[index]["Image"]
    wikiInfo = await getWiki(index) // get the player's wikipedia biography
    document.getElementById("bio_text").innerHTML = obj.text

    // update the player's two videos
    setYTVideo("video_1", index, "Video 1")
    setYTVideo("video_2", index, "Video 2")

    // display the player's information page
    infoBackground = document.getElementById("info_background")
    infoBackground.classList.remove("hidden")
    infoContainer = document.getElementById("info_container")
    infoContainer.classList.remove("hidden")
    document.body.style.overflow = "hidden";

    // exit into musician's page
    infoBackground.addEventListener("click", function(e) {
        closeButton = document.getElementById("close_button")
        if (e.target == infoBackground || e.target == closeButton) {
            document.getElementById("info_background").classList.add("hidden")
            document.getElementById("info_container").classList.add("hidden")
            document.body.style.overflow = "";
        }
    })
}

// Wikipedia API to get the biography section.
async function getWiki(index) {
    var name = data[index]["Name"]
    var name2 = name.replaceAll(" ", "_")

    const url = "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
        origin: "*",
        action: "query",
        prop: "extracts",
        format: "json",
        exintro: name2,
        titles: name2,
    });

    try {
        const req = await fetch(url)
        const json = await req.json()
    
        obj = {}

        let page = json.query.pages
        let pageId = Object.keys(json.query.pages)[0]
        let content = page[pageId].extract
        let wikiPage = document.createElement("html") 
        wikiPage.innerHTML = content

        if (pageId == -1) {
            obj.text = data[index]["Biography"]
        } else {
            text = wikiPage.innerText
            // cool feature finding given seqence of characters
            const regex = /\[[0-9]*\]/gi
            obj.text = text.replaceAll(regex, "")
        } 

    return obj

    } catch (e) {
        console.error(e)
    }
}

function setYTVideo(videoID, index, jsonID) {
    video = document.getElementById(videoID)
    video.src = data[index][jsonID]
    setVideoAttributes(video)
}

function setVideoAttributes(variable) {
    variable.setAttribute("allowfullscreen", "")
    variable.setAttribute("width", "520px")
    variable.setAttribute("height", "295px")
}
