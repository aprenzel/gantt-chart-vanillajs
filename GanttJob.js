import GanttJobDialog from "./GanttJobDialog.js";

  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
  
   .job{
        position: absolute;
        height:38px;
        top:5px;
        width: calc(2*100%);
        z-index: 100;
        background-color:#1cad2d;
        border-radius: 0px;
        cursor: pointer;
    }

    .job::after {
        content: '';
        background-color: #646965;
        position: absolute;
        right: 0;
        width: 4px;
        height: 100%;
        cursor: ew-resize;
    }

    </style>

    <div class="job"></div>
    `
  ;

  export default class Job extends HTMLElement {

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    _job;
    _zoom = "year-month";

    connectedCallback() {

        var jobElement = this.shadowRoot.querySelector(".job");
        jobElement.id = this.id;
        jobElement.draggable = true;

        this._render();
        this.makeEditable();
    }

    disconnectedCallback() {
 
      var panel = this.shadowRoot.querySelector(".job");
      panel.removeEventListener("dblclick", this._handleDblClick);
      panel.removeEventListener("mousedown", this._handleMouseDown, false);
      document.removeEventListener("mouseup", this._handleMouseUp, false);
    }

    update(){
      this._render();
    }

    _render(){

      var jobElement = this.shadowRoot.querySelector(".job");
      var d;

      if(this._zoom == "year-month"){
        d = this._dayDiff(this.job.start, this.job.end);
      }else{//zoom = "day"
        d = this._hourDiff(this.job.start, this.job.end);
      }

      jobElement.style.width = "calc("+(d*100)+"% + "+ d + "px)";
    }

    makeEditable(){

       var panel = this.shadowRoot.querySelector(".job");
       panel.addEventListener("dblclick", this._handleDblClick);
    }

    _handleDblClick = function(e){

        var panel = this.shadowRoot.querySelector(".job");
        panel.style.zIndex = 101;

        var dialogElement = document.createElement("gantt-job-dialog");
        dialogElement.job = this.job;
        dialogElement.xPos = 0;
        dialogElement.yPos = 40;
        dialogElement.zoom = this.zoom;
      
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
    
      if (e.offsetX >= (current_width - this._BORDER_SIZE)) {

        return true;
      }

      return false;

    }.bind(this);


    _BORDER_SIZE = 4;

  
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

    set zoom(newValue){
      this._zoom = newValue;
    }

    get zoom(){
        return this._zoom;
    }

}

window.customElements.define('gantt-job', Job);

