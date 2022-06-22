import GanttJobDialog from "./GanttJobDialog.js";

  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
      @import "./styles/GanttJob.css";
    </style>

    <div class="job"></div>
    `
  ;

  export default class GanttJob extends HTMLElement {

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    _job;
    _level = "year-month";

    connectedCallback() {

        var jobElement = this.shadowRoot.querySelector(".job");
        jobElement.id = this.id;
        jobElement.draggable = true;

        this._render();
    }

    disconnectedCallback() {
 
    }

    update(){
      this._render();
    }

    _render(){

      var jobElement = this.shadowRoot.querySelector(".job");
      var d;

      if(this._level == "year-month"){
        d = this._dayDiff(this.job.start, this.job.end);
      }else{//level = "day"
        d = this._hourDiff(this.job.start, this.job.end);
      }

      jobElement.style.width = `calc(${d*100}% + ${d}px)`;
    }

    _handleDblClick = function(){

        var panel = this.shadowRoot.querySelector(".job");
        panel.style.zIndex = 101;

        var dialogElement = document.createElement("gantt-job-dialog");
        dialogElement.job = this.job;
        dialogElement.xPos = 0;
        dialogElement.yPos = 40;
        dialogElement.level = this.level;
      
        panel.appendChild(dialogElement);

        dialogElement.addEventListener("cancel", () => {
          panel.style.zIndex = 100;
          dialogElement.remove();
        });

        dialogElement.addEventListener("save", () => {
          this.update();
          panel.style.zIndex = 100;
          dialogElement.remove();
          this.dispatchEvent(new CustomEvent("editjob"));
        });

    }.bind(this);


    isMouseOverDragHandle = function(e){

      var panel = this.shadowRoot.querySelector(".job");
      var current_width = parseInt(getComputedStyle(panel, '').width);
    
      if (e.offsetX >= (current_width - this._HANDLE_SIZE)) {
        return true;
      }

      return false;

    }.bind(this);


    _HANDLE_SIZE = 4;

  
    _dayDiff(d1, d2){
    
        var diffTime = Math.abs(d2 - d1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    _hourDiff(d1, d2){

      var diffTime = Math.abs(d2 - d1);
      var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
      return diffHours;
    }

    set job(newValue){
        this._job = newValue;
        this._render();
    }
  
    get job(){
        return this._job;
    }

    set level(newValue){
      this._level = newValue;
    }

    get level(){
        return this._level;
    }

}

window.customElements.define('gantt-job', GanttJob);

