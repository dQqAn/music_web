async function getFavStatus(soundID) {
    try {
        const res = await fetch(`/sound/checkFav/${soundID}`);
        const data = await res.json();
        return data.favouriteStatus;
    } catch (error) {
        console.error('soundList Error:', error);
        return false
    }
}

export async function createFavDiv(favDivID, soundID, main = false) {
    const isFav = await getFavStatus(soundID);
    const favText = isFav ? "heart" : "heart-off";

    const favID = main ? "main-fav-btn-" + soundID : "fav-btn-" + soundID
    document.getElementById(favDivID).innerHTML = `
                    <button id=${favID} >
                         <i data-lucide="${favText}" class="${favID} w-6 h-6"></i>
                     </button>
                `;
    const favBtn = document.getElementById(favID)
    favBtn.onclick = () => {
        if (isFav) {
            changeSoundFavouriteStatus(soundID, favID)
        }
    }
    lucide.createIcons();
}

async function changeSoundFavouriteStatus(soundID, favID) {
    try {
        const response = await fetch('/database/favouriteSound', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({soundIDs: [soundID]})
        });

        if (!response.ok) {
            console.log("Error backend.")
            return;
        }

        const result = await response.json();
        const newStatus = result.favouriteStatus;

        const favIcon = document.querySelector('.fav-btn-' + soundID)
        if (favIcon) {
            favIcon.setAttribute('data-lucide', newStatus ? "heart" : "heart-off");
            lucide.createIcons();
        }

        const favIcon2 = document.querySelector('.main-fav-btn-' + soundID)
        if (favIcon2) {
            favIcon2.setAttribute('data-lucide', newStatus ? "heart" : "heart-off");
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error');
    }
}