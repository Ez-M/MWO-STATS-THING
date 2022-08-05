import fetch from "node-fetch";
import fs from "fs";

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

// const url = "https://mwomercs.com/api/v1/matches/160474522304217?api_token=Gbz4lg4OIZcssVmqNove98pQVHnzRKctUZpsTZIx5xGQpWQ7eL0n8GdxBaUl";

// let url = `https://mwomercs.com/api/v1/matches/${matchID}?api_token=Gbz4lg4OIZcssVmqNove98pQVHnzRKctUZpsTZIx5xGQpWQ7eL0n8GdxBaUl`;

function mainFunc(matchIDin, unitTagIn) {
  let desiredTag = unitTagIn;
  let matchID = matchIDin;
  const url = "https://mwomercs.com/api/v1/matches/160474522304217?api_token=Gbz4lg4OIZcssVmqNove98pQVHnzRKctUZpsTZIx5xGQpWQ7eL0n8GdxBaUl";

  let oldData = loadRoster(); //pull exising pilot records from saved file
  console.log("oldData pulled" + oldData); //sanity check

  getData(url).then(res => console.log(res))
 
  
  // 
  /* 
  .then(res => res.json())
  .then(data => {
    let newData = data;
console.log(newData);

    let finishedData = mergeRecords(oldData, newData, desiredTag); //process the new data into the old data
  console.log("finishedData pulled " + finishedData);

  saveRecords(finishedData); //save the processed data
  console.log("finishedData saved");
  });  //pull new data from API with matchID  

  
  */
}

const getData = async (url) => {
  const newData = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Accept: "Application/json",
    },
  })
    // .then(res => res.json());
     .then((response) => {
      let potato = response.json();
      

      return potato;
    }).then((data => {
      // console.log(data)      

      return data      
    }))
    
    return newData;  
};

function mergeRecords(oldDataIn, newDataIn, desiredTagIn) {

  let workingData = oldDataIn; 
  console.log(newDataIn.UserDetails);

  for (var X in newDataIn.UserDetails) {
    let currentBoi = newDataIn.UserDetails[X]; // select the input data we're checking for
    if (  true
      /* desiredTagIn !== undefined
        ? currentBoi.UnitTag == toString(desiredTagIn)
        : true */
    ) {
      //check first if a valid unit tag has been entered, otherwise simply run all pilots
      // console.log(currentBoi);

      let nameCheck = -1;

      for (var Y in workingData.Pilots) {
        let targetBoi = workingData.Pilots[Y]; // select the saved data we're checking against

        if (targetBoi.Username.indexOf(currentBoi.Username) !== -1) {
          //checking if the inputData matches any names in the saved data's username array. This will allow for potentially merging new and old account names
          targetBoi.MechItemID.push(currentBoi.MechItemID);
          targetBoi.MechName.push(currentBoi.MechName);
          targetBoi.SkillTier.push(currentBoi.SkillTier);
          targetBoi.HealthPercentage.push(currentBoi.HealthPercentage);
          targetBoi.Kills.push(currentBoi.Kills);
          targetBoi.KillsMostDamage.push(currentBoi.KillsMostDamage);
          targetBoi.Assists.push(currentBoi.Assists);
          targetBoi.ComponentsDestroyed.push(currentBoi.ComponentsDestroyed);
          targetBoi.MatchScore.push(currentBoi.MatchScore);
          targetBoi.Damage.push(currentBoi.Damage);
          targetBoi.TeamDamage.push(currentBoi.TeamDamage);
          targetBoi.matchIDs.push(matchID);
        } else {
          nameCheck++;

          if (nameCheck > workingData.Pilots.length) {
            let newPilot = {
              Username: [currentBoi.Username],
              MechItemID: [currentBoi.MechItemID],
              MechName: [currentBoi.MechName],
              SkillTier: [currentBoi.SkillTier],
              HealthPercentage: [currentBoi.HealthPercentage],
              Kills: [currentBoi.Kills],
              KillsMostDamage: [currentBoi.KillsMostDamage],
              Assists: [currentBoi.Assists],
              ComponentsDestroyed: [currentBoi.ComponentsDestroyed],
              MatchScore: [currentBoi.MatchScore],
              Damage: [currentBoi.Damage],
              TeamDamage: [currentBoi.TeamDamage],
              matchIDs: [matchID],
            };
            workingData.Pilots.push(newPilot);
          }
        }
      }
    }
  }

  return workingData;
}

function loadRoster() {
  let rawData = fs.readFileSync("./teamData.json");
  return JSON.parse(rawData);
}

function saveRecords(finishedDataIn) {
  for (var x in finishedDataIn.Pilots){
    // console.log(finishedDataIn.Pilots[x]);
  }
  // console.log(finishedDataIn);
}

const matchIDTest = 160474522304217;
const unitTagTest = "AW";

mainFunc(matchIDTest, unitTagTest);

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

/* 
    let nameCheck = 0;
    
  for x in dataIn.UserDetails {
    let currentBoi = dataIn.UserDetails[x]; // select the input data we're checking for


      for Y in oldData.Pilots {
        let targetBoi = oldData.Pilots[Y];  // select the saved data we're checking against


        if (targetBoi.Username.indexOf(currentBoi.Username) !== -1 ){   //checking if the inputData matches any names in the saved data's username array. This will allow for potentially merging new and old account names
          targetBoi.MechItemID.push(currentBoi.MechItemID);
          targetBoi.MechName.push(currentBoi.MechName);
          targetBoi.SkillTier.push(currentBoi.SkillTier);
          targetBoi.HealthPercentage.push(currentBoi.HealthPercentage);
          targetBoi.Kills.push(currentBoi.Kills);
          targetBoi.KillsMostDamage.push(currentBoi.KillsMostDamage);
          targetBoi.Assists.push(currentBoi.Assists);
          targetBoi.ComponentsDestroyed.push(currentBoi.ComponentsDestroyed);
          targetBoi.MatchScore.push(currentBoi.MatchScore);
          targetBoi.Damage.push(currentBoi.Damage);
          targetBoi.TeamDamage.push(currentBoi.TeamDamage);
          targetBoi.matchIDs.push(matchID);
        } else {
          
          nameCheck++

           if nameCheck > oldData.Pilots.length {
          let newPilot = {
            
        "Username": [currentBoi.Username],  
        "MechItemID": [currentBoi.MechItemID],
        "MechName": [currentBoi.MechName],
        "SkillTier": [currentBoi.SkillTier],
        "HealthPercentage": [currentBoi.HealthPercentage],
        "Kills": [currentBoi.Kills],
        "KillsMostDamage": [currentBoi.KillsMostDamage],
        "Assists": [currentBoi.Assists],
        "ComponentsDestroyed": [currentBoi.ComponentsDestroyed],
        "MatchScore": [currentBoi.MatchScore],
        "Damage": [currentBoi.Damage],
        "TeamDamage": [currentBoi.TeamDamage],
        "matchIDs": [matchID]
              }          
          oldData.Pilots.push(newPilot)
        }
        
        }
        
       
      }
    
  }
  */
