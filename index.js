import VanillaGanttChart from "./VanillaGanttChart.js";

var chart = document.querySelector("#g1");

var jobs = [
    {id: "j1", start: new Date("2021/6/1"), end: new Date("2021/6/4"), resource: 1},
    {id: "j2", start: new Date("2021/6/4"), end: new Date("2021/6/13"), resource: 2},
    {id: "j3", start: new Date("2021/6/13"), end: new Date("2021/6/21"), resource: 3},
];
var p_jobs = [];

chart.resources = [{id:1, name: "Task 1"}, {id:2, name: "Task 2"}, {id:3, name: "Task 3"}, {id:4, name: "Task 4"}];

jobs.forEach(job => {

    var validator = {
        set: function(obj, prop, value) {

            console.log("Job " + obj.id + ": " + prop + " was changed to " + value);
            console.log();
            obj[prop] = value;
            return true;
        },

        get: function(obj, prop){

            return obj[prop];
        }
    };

    var p_job = new Proxy(job, validator);
    p_jobs.push(p_job);
});

chart.jobs = p_jobs;
  