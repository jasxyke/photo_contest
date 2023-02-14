const container = document.querySelector('#entries-container')

function renderEntries(entries){
    clearEntries();
    console.log('Entries from server: ', entries);
    let entriesBox = '';
    if(entries !== null && entries.length > 0){
        entries.forEach(entry => {
            let entry_card = `<div class="gallery">
            <a href="/entries/view/${entry.id}">
              <img src="${entry.file_path}" alt="${entry.title}" width="600" height="400">
              <h3>${entry.title}</h3>
              <p>Date posted: ${new Date(entry.submitted_at).toDateString()}</p>
            </a>
                <div class="btn-entries">
                    <h4>@${entry.username}</h4>
                    <div class="btn-container" name="${entry.id}">
                    <button class="btn-like" style="cursor: pointer;" 
                    onclick='window.location.replace("http://localhost:300/login");'>Like Photo</button>
                    </div>
                    <div class="count-container">
                        <span class="material-symbols-outlined">thumb_up</span>
                        <h3 class="like-counter" id="counter-${entry.id}">${entry.likes}</h3>
                    </div>
                    </div>
               </div>
           </div>`
           entriesBox += entry_card;
        });
    }
    container.innerHTML = entriesBox

}

async function getLatestEntries(){
    try{
        let url = '/entries/all';
        console.log('getting latest entries...');
        let response = await fetch(url);
        console.log(response.status);
        if(response.status === 200){
            renderEntries(await response.json())
        }
    }catch(e){
        console.log(e);
    }
}

async function getOldestEntries(){
    try{
        let url = '/entries/DESC';
        console.log('getting oldest entries...');
        let response = await fetch(url);
        console.log(response.status);
        if(response.status === 200){
            renderEntries(await response.json())
        }
    }catch(e){
        console.log(e);
    }
}

function clearEntries(){
    container.innerHTML = ''
}

getLatestEntries();