
  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
        @import "./styles/GanttJobDialog.css";
    </style>

    <div class="dialog">
    </div>
    `
  ;

  export default class GanttJobDialog extends HTMLElement {

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    _job;
    _xPos;
    _yPos;
    _level = "year-month";
  
    connectedCallback() {
        this._render();      
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector("#cancel_button").removeEventListener("click", this._handleCancel);

        this.shadowRoot.querySelector("#save_button").removeEventListener("click", this._handleSave);

        document.removeEventListener("click", this._handleClickOutside);
    }

   
    _render(){
 
        var dialogElement = this.shadowRoot.querySelector(".dialog");
        dialogElement.style.left = this._xPos+"px";
        dialogElement.style.top = this._yPos+"px";

        if(this.level == "year-month"){

            dialogElement.innerHTML = `
                <h4 id="job_title">Edit Task</h4>
                <form action="#">
                <p>
                    <label for="start">Start</label>
                    <input type="date" id="start_input" name="start" value="${this.job.start.getFullYear()}-${this.zeroPad(this.job.start.getMonth()+1)}-${this.zeroPad(this.job.start.getDate())}">
                </p>
                <p>
                    <label for="start">End</label>
                    <input type="date" id="end_input" name="start" value="${this.job.end.getFullYear()}-${this.zeroPad(this.job.end.getMonth()+1)}-${this.zeroPad(this.job.end.getDate())}">
                </p>
                <p>
                    <input type="button" id="cancel_button" value="Cancel">
                    <input type="button" id="save_button" value="Save">
                </p>
                </form>        
            `;
        }else{

            dialogElement.innerHTML = `
            <h4 id="job_title">Edit Task</h4>
            <form action="#">
            <p>
                <label for="start">Start</label>
                <input type="datetime-local" id="start_input" name="start" value="${this.job.start.getFullYear()}-${this.zeroPad(this.job.start.getMonth()+1)}-${this.zeroPad(this.job.start.getDate())}T${this.zeroPad(this.job.start.getHours())}:00">
            </p>
            <p>
                <label for="start">End</label>
                <input type="datetime-local" id="end_input" name="start" value="${this.job.end.getFullYear()}-${this.zeroPad(this.job.end.getMonth()+1)}-${this.zeroPad(this.job.end.getDate())}T${this.zeroPad(this.job.end.getHours())}:00">
            </p>
            <p>
                <input type="button" id="cancel_button" value="Cancel">
                <input type="button" id="save_button" value="Save">
            </p>
            </form>        
        `;
        }

        this.shadowRoot.querySelector("#cancel_button").addEventListener("click", this._handleCancel);

        this.shadowRoot.querySelector("#save_button").addEventListener("click", this._handleSave);

        document.addEventListener("click", this._handleClickOutside);

    }


    _handleCancel = function(e){

        var dialogElement = this.shadowRoot.querySelector(".dialog");
        this.dispatchEvent(new CustomEvent("cancel"));
        dialogElement.style.visibility = "hidden";

    }.bind(this);


    _handleSave = function(e){

        var dialogElement = this.shadowRoot.querySelector(".dialog");
        this.job.start = new Date(this.shadowRoot.querySelector("#start_input").value);
        this.job.end = new Date(this.shadowRoot.querySelector("#end_input").value);

        this.dispatchEvent(new CustomEvent("save"));
        dialogElement.style.visibility = "hidden";

    }.bind(this);


    _handleClickOutside = function(e){

        var dialogElement = this.shadowRoot.querySelector(".dialog");

        var items = this.shadowRoot.elementsFromPoint(e.offsetX, e.offsetY);
        var close = true;
        
        items.forEach(item => {
            if(item.classList.contains("dialog")){
                close = false;
                return;
            }
        });

        if(close){
            this.dispatchEvent(new CustomEvent("cancel"));
            dialogElement.style.visibility = "hidden";
        }
    }.bind(this);


    zeroPad(n){
        return n<10 ? "0"+n : n;    
    }
    
    set job(newValue){
        this._job = newValue;
        this._render();
    }
  
    get job(){
        return this._job;
    }

    set xPos(newValue){
        this._xPos = newValue;
        this._render();
    }

    set yPos(newValue){
        this._yPos = newValue;
        this._render();
    }

    set level(newValue){
       this._level = newValue;
    }

    get level(){
       return this._level;
    }
}

window.customElements.define('gantt-job-dialog', GanttJobDialog);

