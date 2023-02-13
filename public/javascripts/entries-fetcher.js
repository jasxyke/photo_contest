const container = document.querySelector('#entries-container')

function renderEntries(entries){
    clearEntries();
    console.log('Entries from server: ', entries);
    let entriesBox = '';
    if(entries !== null && entries.length > 0){
        entries.forEach(entry => {
            let entry_card = `<div class="gallery">
            <a href="/entires/${entry.id}">
              <img src="../../public/assets/featsample_01.jpg" alt="Cinque Terre" width="600" height="400">
              <h3>loki the loyal dogloki the loyal dog</h3>
              <p>Date posted: Feb 08, 2023</p>
            </a>
                <div class="btn-entries">
                    <h4>@Tophergacad</h4>
                    <div class="btn-container">
                        <button type="button" class="entry-like" style="cursor: pointer;">
                            <span class="material-symbols-outlined">thumb_up</span>
                        </button>
                        <p>320</p>
                    </div>
               </div>
           </div>`
        });
    }
}

function clearEntries(){
    container.innerHTML = ''
}