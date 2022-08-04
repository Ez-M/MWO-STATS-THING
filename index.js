import fetch from "node-fetch";
import fs from 'fs';

// const https = require("https");

// const getData = async (url) => {https.get(url, (resp) => {
//       let data = "";

//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         // console.log(JSON.parse(data));
//         data = JSON.parse(data);



//         console.log("getdata done");


//         // console.log(firstObj)
//         return data;
//       });
//     });    
// };

/* 
    {    
    "Pilots":   [
        Username: ['ArkonEnt'],  
        MechItemID: [408],
        MechName: ['kdk-3'],
        SkillTier: [1],
        HealthPercentage: [40],
        Kills: [0],
        KillsMostDamage: [0],
        Assists: [5],
        ComponentsDestroyed: [0],
        MatchScore: [121],
        Damage: [184],
        TeamDamage: [21],
        matchIDs: []
    ]
}
*/




const url = "https://mwomercs.com/api/v1/matches/160474522304217?api_token=Gbz4lg4OIZcssVmqNove98pQVHnzRKctUZpsTZIx5xGQpWQ7eL0n8GdxBaUl";



let finishedData = [];


function mainFunc(){

    let pilots = loadRoster();
    console.log(pilots)
    getData(url);
}


const getData = async (url) => {

    const newData = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Accept': 'Application/json'
      }
    })
    // .then(res => res.json());
    .then((response)=> {

      let potato = response.json()

     return potato;

    })
    .then((data) =>{
    //   console.log(data)
      trimData(data);
        })
    // console.log(newData);
    // setReturnedData(newData);

  };


  function trimData(dataIn){
    for(var X in dataIn.UserDetails){
        let currentBoi = dataIn.UserDetails[X]; 
        if(currentBoi.UnitTag == "AW"){
            // console.log(currentBoi);
        }
        
    }
    
  }

  function loadRoster(){
    let rawData = fs.readFileSync('./teamData.json');
     return JSON.parse(rawData);
  }

  mainFunc();



  /* 
    let nameCheck = 0;
    
  for x in dataIn.UserDetails {
    let currentBoi = dataIn.UserDetails[x];
      for Y in pilots.Pilots {
        let targetBoi = pilots.Pilots[Y];


        if currentBoi.Username == targetBoi.Username{
          push all desired data into its respective array, and push the current matchID to the matchID array;
        } else if nameCheck > pilots.Pilots.length {
          create new pilot in records, and push all relevant data to its arrays, and push matchID;
        }
      }
    
  }
  */