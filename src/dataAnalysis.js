
// import { testData } from "./TestData";

var testData = { 
    "events": [ 
        {
            "timestamp": 1,
            "gamestate": {},
            "eventName": "beginTrial",
        },
        {
            "timestamp": 2,
            "gamestate": {},
            "eventName": "questionAppeared",
        },
        {
            "timestamp": 4,
            "gamestate": {},
            "eventName": "answeredCorrectly",
        },
        {
            "timestamp": 5,
            "gamestate": {},
            "eventName": "questionAppeared",
        },
        {
            "timestamp": 7,
            "gamestate": {},
            "eventName": "answeredWrong",
        },
        {
            "timestamp": 8,
            "gamestate": {},
            "eventName": "endTrial",
        },
        {
            "timestamp": 10,
            "gamestate": {},
            "eventName": "beginTrial",
        },
        {
            "timestamp": 11,
            "gamestate": {},
            "eventName": "questionAppeared",
        },
        {
            "timestamp": 15,
            "gamestate": {},
            "eventName": "warningAppeared",
        },
        {
            "timestamp": 18,
            "gamestate": {},
            "eventName": "warningInteraction",
        },
        {
            "timestamp": 19,
            "gamestate": {},
            "eventName": "answeredCorrectly",
        },
        {
            "timestamp": 20,
            "gamestate": {},
            "eventName": "endTrial",
        },
    ]
};

// to test
console.log(process(testData));

// takes in all of the events -> returns processed event data
function process(allData) {

    // copy the data to avoid mutation
    let data = allData.events.slice();

    // get arrays of the times we want collected
    let questionAnswerTime = timeBetween("questionAppeared", "answeredCorrectly", "answeredWrong", data);
    let trialTime = timeBetween("endTrial", "beginTrial", "beginTrial", data);
    let warningInteractionTime = timeBetween("warningAppeared", "warningInteraction", "warningInteraction", data);

    // compute the averages
    let avgQuestionAnswerTime = average(questionAnswerTime);
    let avgTrialTime = average(trialTime);
    let avgWarningInteractionTime = average(warningInteractionTime)

    // json data structure to send back
    var processedData = `{
        questionToAnswer: {
            times : ${questionAnswerTime},
            average : ${avgQuestionAnswerTime},
        },
        trialToTrial: {
            times : ${trialTime},
            average : ${avgTrialTime},
        },
        warningToInteraction: {
            times : ${warningInteractionTime},
            average : ${avgWarningInteractionTime},
        }, 
    }`;

    // return the data
    var obj = processedData;
    return obj;
}


// returns an array containing the times between an initial event and ending event for all of the data
// there are 2 ending events for the case of a question appearing and it being answered so both can be passed in
function timeBetween(initEvent, endEvent1, endEvent2, data) {
    var arr = [];
    var initTime = 0;
    var endTime = 0;

    for (let index = 0; index < data.length; index++) {
        let thisEvent = data[index];
        if (thisEvent.eventName === initEvent) {
            initTime = thisEvent.timestamp;
        } else if (thisEvent.eventName === endEvent1 || thisEvent.eventName === endEvent2) {
            endTime = thisEvent.timestamp;
            if (initTime !== 0) {
                arr.push(endTime - initTime);
            }
        }
    }
    return arr;
}

// returns the average given an array
function average(arr) {
    let avg = arr.reduce((a,b) => a + b, 0) / arr.length;
    return avg;
}
