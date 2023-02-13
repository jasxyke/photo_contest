

function renderLeaderboards(lBoards){
    clearLeaderboards();
    console.log('lboards: ', lBoards);
    let container = document.querySelector('#lboard-table')
    let lBoardBox = '';
    let tableHeader = `<tr>
            <th class="rank-th"><span class="material-symbols-outlined">leaderboard</span>Ranking</th>
            <th class="tb-header">Uploader</th>
            <th class="tb-header">Image Title</th>
            <th class="tb-header">No. of Likes</th>
        </tr>`
    lBoardBox += tableHeader;
    if(lBoards !== null && lBoards.length > 0){
        lBoards.forEach((entry, index) => {
            let tableRow = `
        <tr>
            <td class="rank-spot"><span class="material-symbols-outlined">workspace_premium</span>Rank ${index+1}</td>
            <td class="rank-user"><a href="/users/${entry.username}">${entry.firstname + entry.lastname}</a></td> 
            <td class="rank-img"><a href="/entry/${entry.id}">${entry.title}</a></td>  
            <td>${entry.likes}</td>
          </tr>`;
    
          lBoardBox += tableRow;
        });
    }
    container.innerHTML = lBoardBox;
}


async function getCurrentLeaderboards(){
    try{
        let url = '/entries/leaderboards/this'
        console.log('getting current leaderboards');
        let response = await fetch(url)
        console.log(response.status);
        if(response.status === 200){
            renderLeaderboards(await response.json())
        }
    }catch(e){
        console.log(e);
    }
    
}

async function getPrevLeaderboards(){
    try{
        let url = '/entries/leaderboards/prev'
        let response = await fetch(url)
        console.log(response.status);
        if(response.status === 200){
            renderLeaderboards(await response.json());
        }
    }catch(e){
        console.log(e);
    }
    
}

function clearLeaderboards(){
    document.querySelector("#lboard-table").innerHTML = ''
}

getCurrentLeaderboards();


