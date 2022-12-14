import fetch from "node-fetch";
import fs from "fs";
import inquirer from "inquirer";
import { match } from "assert";
import path from "path";

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

function mainFunc(matchIDin, unitTagIn, targetFileIn) {
  let desiredTag = unitTagIn;
  let numOID = matchIDin.length;
  let targetFile = targetFileIn;
  console.log(matchIDin.length);

  let oldData = loadRoster(targetFile) //pull exising pilot records from saved file    

      console.log("oldData pulled" + oldData); //sanity check

      for (let i = 0; i < matchIDin.length; i++) {
        let matchID = matchIDin[i];
    
        let url = `https://mwomercs.com/api/v1/matches/${matchID}?api_token=Gbz4lg4OIZcssVmqNove98pQVHnzRKctUZpsTZIx5xGQpWQ7eL0n8GdxBaUl`;
    
        getData(url)
          .then((res) => {
            //pull new data from API with matchID
    
            let newData = res;
    
            let finishedData = mergeRecords(oldData, newData, desiredTag, matchID); //process the new data into the old data
            oldData = finishedData;
            console.log("finishedData pulled ");
    
            return finishedData;
          })
          .then((res) => {
            if (i == matchIDin.length - 1) {
              // console.log('done')
              saveRecords(res); //save the processed data
              console.log("finishedData saved");
            }
          });
      }


      
    
  
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
    })
    .then((data) => {
      // console.log(data)

      return data;
    });

  return newData;
};

function mergeRecords(oldDataIn, newDataIn, desiredTagIn, matchIDin) {
  let matchID = matchIDin;

  let workingData = oldDataIn;

  let filterTag = desiredTagIn;
  if (typeof filterTag === "undefined") {
    filterTag = "";
  }
  // console.log(newDataIn.UserDetails);

  for (var X in newDataIn.UserDetails) {
    let currentBoi = newDataIn.UserDetails[X]; // select the input data we're checking for

    if (filterTag !== "" ? currentBoi.UnitTag == filterTag : true) {
      //check first if a valid unit tag has been entered, otherwise simply run all pilots
      // console.log(currentBoi);

      let nameCheck = 0;

      if (workingData.Pilots.length == 0) {
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
          MatchIDs: [matchID],
        };
        workingData.Pilots.push(newPilot);
      } else {
        for (var Y in workingData.Pilots) {
          let targetBoi = workingData.Pilots[Y]; // select the saved data we're checking against

          if (targetBoi.Username.indexOf(currentBoi.Username) !== -1) {
            if (targetBoi.MatchIDs.indexOf(matchID) === -1) {
              //checking if the inputData matches any names in the saved data's username array. This will allow for potentially merging new and old account names
              targetBoi.MechItemID.push(currentBoi.MechItemID);
              targetBoi.MechName.push(currentBoi.MechName);
              targetBoi.SkillTier.push(currentBoi.SkillTier);
              targetBoi.HealthPercentage.push(currentBoi.HealthPercentage);
              targetBoi.Kills.push(currentBoi.Kills);
              targetBoi.KillsMostDamage.push(currentBoi.KillsMostDamage);
              targetBoi.Assists.push(currentBoi.Assists);
              targetBoi.ComponentsDestroyed.push(
                currentBoi.ComponentsDestroyed
              );
              targetBoi.MatchScore.push(currentBoi.MatchScore);
              targetBoi.Damage.push(currentBoi.Damage);
              targetBoi.TeamDamage.push(currentBoi.TeamDamage);
              targetBoi.MatchIDs.push(matchID);
            }
          } else {
            nameCheck++;

            if (nameCheck >= workingData.Pilots.length) {
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
                MatchIDs: [matchID],
              };
              workingData.Pilots.push(newPilot);
            }
          }
        }
      }
    }
  }

  return workingData;
}

function loadRoster(targetFileIn) {
  let targetPath = `./rosters/${targetFileIn}`;
  let rawData = fs.readFileSync(targetPath);  
      return JSON.parse(rawData);    
         }
    


function saveRecords(finishedDataIn) {
  for (var x in finishedDataIn.Pilots) {
    console.log(finishedDataIn.Pilots[x]);
  }

  fs.writeFileSync("./teamData.json", JSON.stringify(finishedDataIn));
  // console.log(finishedDataIn);
}

function getRosters() {
  // try{
  if (fs.existsSync("./rosters") == true) {
    console.log("directory exists.");
  } else {
    fs.mkdir("./rosters", (err) => {
      if (err) {
        return err;
      }
    });
    console.log("Roster directory did not exist, creating roster folder");
  }

  const rostersList = fs.readdirSync("./rosters");

  rostersList.push("Make New Roster");

  return rostersList;

  // } catch(e) {
  //   console.log("An error occured.");
  // }
}

function makeNewRoster(newFileNameIn) {
  fs.writeFileSync(
    `./rosters/${newFileNameIn}.json`,
    '{"Pilots":[]}',
    function (err) {
      if (err) throw err;
      console.log("New Roster Saved!");
    }
  );
}

function validateFileInit(targetFileIn) {
  
    let fileCheck = fs.readFileSync(`./rosters/${targetFileIn}`)
    if(fileCheck == "" || fileCheck == "{}"){
      fs.writeFileSync(`./rosters/${targetFileIn}`, '{"Pilots":[]}', function (err) {
        if (err) throw err;
        console.log('New Roster Saved!')
      })}
}

const matchIDTest = [
  152567485709779, 152352737344201, 152889608258195, 152515946102057,
  152696334729162,
];

const unitTagTest = "AW";

const testText = "sss";

const rostersList = getRosters();

inquirer
  .prompt([
    {
      type: "list",
      name: "targetFile",
      message: "Which roster would you like to use?",
      choices: rostersList,
    },
  ])
  .then((data) => {
    if (data.targetFile == "Make New Roster") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "newFileName",
            message: "What would you like this roster to be titled?",
            validate: function (newFileName) {
              let valid = /([A-Z]|[a-z]|[0-9]|_|-|\.|\s)+/i.test(newFileName);
              if (valid) {
                return true;
              } else {
                return fasle;
              }
            },
          },
        ])
        .then((res) => {
          let newRoster = makeNewRoster(res.newFileName);
          return newRoster;
        });
    } else {
      validateFileInit(data.targetFile);






      mainFunc(matchIDTest, unitTagTest, data.targetFile);
    }
  });

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

/* 

160474522304217

  
  */
