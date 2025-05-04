async function getFavStatus(soundID) {
    const res = await fetch(`/sound/checkFav/${soundID}`);
    const data = await res.json();
    return data.favouriteStatus;
}

export async function createFavDiv(favDivID, soundID, main = false) {
    const isFav = await getFavStatus(soundID);
    const favText = isFav ? "Unfav" : "Fav";

    const favID = main ? "main-fav-btn-" + soundID : "fav-btn-" + soundID
    document.getElementById(favDivID).innerHTML = `
                    <button id=${favID} >
                         ${favText}
                     </button>
                `;
    const favBtn = document.getElementById(favID)
    favBtn.onclick = () => {
        changeSoundFavouriteStatus(soundID, favID)
    }
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

        const btn = document.getElementById(favID);
        if (btn) {
            btn.textContent = newStatus ? "Unfav" : "Fav";
        }
    } catch (error) {
        console.error('Error');
    }
}