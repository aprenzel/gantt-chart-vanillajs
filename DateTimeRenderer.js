import GanttJob from "./GanttJob.js";

export function DateTimeRenderer(root){

    var shadowRoot = root;

    var names = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    
    this.resources=[];
    this.jobs = [];

    this.selectedJob = null;
    this.selectedJobElement = null;

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var dateSelectFrom;
    var dateSelectTo;
   
    var getDateFrom = function() {
      return dateSelectFrom.value;
    }

    var setDateFrom = function(newValue) {
      dateSelectFrom.value = newValue;
    }

    var getDateTo = function() {
      return dateSelectTo.value;
    }

    var setDateTo = function(newValue) {
      dateSelectTo.value = newValue;
    }
    

    var checkElements = function(){

      if(shadowRoot && dateSelectFrom && dateSelectTo){
        return true;
      }
      return false;
    }

    this.clear = function(){

      if(checkElements()){
        
        dateSelectFrom.removeEventListener('change', initGantt);
        dateSelectFrom.remove();

        dateSelectTo.removeEventListener('change', initGantt);
        dateSelectTo.remove();

        var container = shadowRoot.querySelector("#gantt-container");
        container.innerHTML = "";

        container.removeEventListener("mousedown", _handleMouseDown, false);
        document.removeEventListener("mouseup", _handleMouseUp, false);
        container.removeEventListener("dblclick", _handleDblClick, false);
      }
    }

    var initSettings = function(){

        if(shadowRoot){
        shadowRoot.querySelector("#select-from").innerHTML += `
      
           <input type="date" id="from-select-date" name="from-select-date" min="2000/1/1" max="2050/12/31">   
        `;

        shadowRoot.querySelector("#select-to").innerHTML += `
        
            <input type="date" id="to-select-date" name="to-select-date"> 
        `;

        dateSelectFrom = shadowRoot.querySelector('#from-select-date');
        dateSelectTo = shadowRoot.querySelector('#to-select-date');
        
        dateSelectFrom.addEventListener('change', initGantt);
        dateSelectTo.addEventListener('change', initGantt);
         
        setDateFrom(`${this.dateFrom.getFullYear()}-${zeroPad(this.dateFrom.getMonth()+1)}-${zeroPad(this.dateFrom.getDate())}`);
        setDateTo(`${this.dateTo.getFullYear()}-${zeroPad(this.dateTo.getMonth()+1)}-${zeroPad(this.dateTo.getDate())}`);
      }
    }.bind(this);

    var initFirstRow = function(){
      
      if(checkElements()){

        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        var resource = document.createElement("div");
        resource.className = "gantt-row-resource";
        container.appendChild(resource);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            
            date_period.innerHTML = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" ("+names[date.getDay()]+")";

            container.appendChild(date_period);
        }
      }
    }

    var initSecondRow = function(){

      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        var resource = document.createElement("div");
        resource.className = "gantt-row-resource";
        resource.style.borderTop = "none";    
        container.appendChild(resource);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var h = 0; h<24; h++){
                
              var period = document.createElement("div");
              period.className = "gantt-row-period";
              period.style.borderTop = "none";
              period.innerHTML = h;
              
              date_period.appendChild(period);
            } 
        }
      }
    }

    var initGanttRows = function(){
      
      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        this.resources.forEach(element => {

        var resource = document.createElement("div");
        resource.className = "gantt-row-resource";
        resource.innerHTML = element.name;
        resource.style.borderTop = "none";    
        container.appendChild(resource);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var h = 0; h<24; h++){

                var item_date = new Date(date);
                item_date.setHours(h);
                
                var period = document.createElement("div");
                period.className = "gantt-row-item";
                period.style.borderTop = "none";
                period.style.borderRight = "none";
                
                if(h==23){
                    period.style.borderRight = "1px solid";
                }
                
                var date_string = formatDate(item_date);
                period.setAttribute("data-date", date_string);
                period.setAttribute("data-resource", element.id);

                period.ondrop = onJobDrop;

                period.ondragover = function(ev){
                  ev.preventDefault();
                }
              
                date_period.appendChild(period);
              }
          }       
        });       
      }
    }.bind(this);

    var onJobDrop = function(ev){

      if(checkElements()){

        var gantt_item = getGanttElementFromPosition(ev.x, ev.y);
       
        var data = ev.dataTransfer.getData("job");               
        var jobElement = shadowRoot.getElementById(data);                
        gantt_item.appendChild(jobElement);

        var job = this.jobs.find(j => j.id == data );

        var start = new Date(gantt_item.getAttribute("data-date"));
        var end = new Date(start);
        end.setHours(start.getHours()+hourDiff(job.start, job.end));

        job.start = start;
        job.end = end;
        job.resource = gantt_item.getAttribute("data-resource");
        jobElement.update();
      }
    }.bind(this);

    var initGantt = function(){

      if(checkElements()){

        if(getDateFrom() > getDateTo()){

          dateSelectFrom.style.color="red";
          dateSelectTo.style.color="red";
  
        }else{

          dateSelectFrom.style.color="black";
          dateSelectTo.style.color="black";

          var container = shadowRoot.querySelector("#gantt-container");
          container.innerHTML = "";

          var first_date = new Date(getDateFrom());
          var last_date = new Date(getDateTo());

          var n_Days = dayDiff(first_date, last_date) 
      
          container.style.gridTemplateColumns = `160px repeat(${n_Days+1},1fr)`;

          initFirstRow();

          initSecondRow();

          initGanttRows();

          initJobs();
        }
     }
  }

  var formatDate = function(d){

    return d.getFullYear()+"-"+zeroPad(d.getMonth()+1)+"-"+zeroPad(d.getDate())+"T"+zeroPad(d.getHours())+":00:00";
    
  }

  var zeroPad = function(n){

    return n<10 ? "0"+n : n;

  }

  function dayDiff(d1, d2){
    
    var diffTime = Math.abs(d2 - d1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }

  function hourDiff(d1, d2){

    var diffTime = Math.abs(d2 - d1);
    var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
    return diffHours;
  }

  var getGanttElementFromPosition = function(x, y){
    var items = shadowRoot.elementsFromPoint(x, y);
    var gantt_item = items[0];

    items.forEach(item => {
      if(item.classList.contains("gantt-row-item")){
        gantt_item = item;
        return;
      }
    });

    return gantt_item;
  }

  var initJobs = function(){

    this.jobs.forEach(job => {

        var date_string = formatDate(job.start);
        var ganttElement = shadowRoot.querySelector(`div[data-resource="${job.resource}"][data-date="${date_string}"]`);

        if(ganttElement){

          var jobElement = document.createElement("gantt-job");
          jobElement.id = job.id;
          jobElement.job = job;
          jobElement.level = "day";

          ganttElement.appendChild(jobElement);

          jobElement.ondragstart = function(ev){
                ev.dataTransfer.setData("job", ev.target.id);
          };

          jobElement.addEventListener("resizejob", (ev) =>{

            var gantt_item = getGanttElementFromPosition(ev.detail.x, ev.detail.y);
            job.end = new Date(gantt_item.getAttribute("data-date"));
            jobElement.update();
            
          });
          
          jobElement.addEventListener("editjob", (ev) =>{

            var date_string = formatDate(job.start);
            var gantt_item = shadowRoot.querySelector(`div[data-resource="${job.resource}"][data-date="${date_string}"]`);
            gantt_item.appendChild(jobElement);
            
          });
        }
    });

    makeJobsResizable();
    makeJobsEditable();
    
  }.bind(this);


  var makeJobsResizable = function(){

    if(checkElements()){

      var container = shadowRoot.querySelector("#gantt-container");

      container.addEventListener("mousedown", _handleMouseDown, false);
      
    }

  }.bind(this);


  var makeJobsEditable = function(){

    if(checkElements()){

      var container = shadowRoot.querySelector("#gantt-container");

      container.addEventListener("dblclick", _handleDblClick, false);
      
    }

  }.bind(this);


  var _handleDblClick = function(e){

    if(e.target.tagName == "GANTT-JOB"){

      var jobElement = e.target;
      jobElement._handleDblClick();
    }
  }

  var _handleMouseDown = function(e){
  
      if(e.target.tagName == "GANTT-JOB"){

       this.selectedJobElement = e.target;
       
       if(this.selectedJobElement.isMouseOverDragHandle(e)){
               
          this.selectedJob = this.jobs.find(j => j.id == e.target.id);

          document.addEventListener("mousemove", _handleMouseMove, false);

          document.addEventListener("mouseup", _handleMouseUp, false);

          e.preventDefault();
        }
      }
    }.bind(this);



    var _handleMouseMove = function(ev){            
         
      var gantt_item = getGanttElementFromPosition(ev.x, ev.y);

      if(this.selectedJob && this.selectedJobElement){
        this.selectedJob.end = new Date(gantt_item.getAttribute("data-date"));
        this.selectedJobElement.update();
      }

    }.bind(this);


    var _handleMouseUp = function(){ 

      this.selectedJob = null;
      this.selectedJobElement = null;
      document.removeEventListener("mousemove", _handleMouseMove, false);
      
    }.bind(this);


   this.render = function(){
      this.clear();
      initSettings();
      initGantt();
   }
}