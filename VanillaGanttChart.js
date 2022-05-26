import {YearMonthRenderer} from './YearMonthRenderer.js';
import {DateTimeRenderer} from './DateTimeRenderer.js';
 
  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
      @import "./styles/VanillaGanttChart.css";
    </style>

    <div id="gantt-settings">
      <select name="select-level" id="select-level">
        <option value="year-month">Month / Day</option>
        <option value="day">Day / Time</option>
      </select>

      <fieldset id="select-from">
        <legend>From</legend>
      </fieldset>

      <fieldset id="select-to">
        <legend>To</legend>
      </fieldset>

    </div>

    <div id="gantt-container">

    </div>   
  `
  ;

  export default class VanillaGanttChart extends HTMLElement {

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.levelSelect = this.shadowRoot.querySelector('#select-level');
    }

    _resources = [];
    _jobs = [];
    _renderer;

    set resources(list){
      this._resources = list;

      if(this.renderer){
        this.renderer.resources = this._resources;
        this.renderer.render();
      }
    }

    get resources(){
      return this._resources;
    }

    set jobs(list){
      this._jobs = list;

      if(this.renderer){
        this.renderer.jobs = this._jobs;
        this.renderer.render();
      }
    }

    get jobs(){
      return this._jobs;
    }

    get level() {
      return this.levelSelect.value;
    }

    set level(newValue) {
      this.levelSelect.value = newValue;
    } 

    get renderer(){
      return this._renderer;
    }

    set renderer(r){
      this._renderer = r;
    }

    connectedCallback() {

      this.changeLevel = this.changeLevel.bind(this);

      this.levelSelect.addEventListener('change', this.changeLevel);
      this.level = "year-month";   
      this.renderer = new YearMonthRenderer(this.shadowRoot);

      this.renderer.dateFrom = new Date(2021,5,1);
      this.renderer.dateTo = new Date(2021,5,24);
      this.renderer.render();
    }

    disconnectedCallback() {
      
      if(this.levelSelect)
        this.levelSelect.removeEventListener('change', this.changeLevel);

      if(this.renderer)
        this.renderer.clear();
    }

    changeLevel(){

      if(this.renderer){
        this.renderer.clear();
      }

      var r;
      
      if(this.level == "year-month"){
    
        r = new YearMonthRenderer(this.shadowRoot);
          
      }else{

        r = new DateTimeRenderer(this.shadowRoot);
      }

      r.dateFrom = new Date(2021,5,1);
      r.dateTo = new Date(2021,5,24);
      r.resources = this.resources;
      r.jobs = this.jobs;
      r.render();

      this.renderer = r;
    }
  }

  window.customElements.define('gantt-chart', VanillaGanttChart);

  