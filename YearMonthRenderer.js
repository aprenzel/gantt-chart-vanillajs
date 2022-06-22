import GanttJob from "./GanttJob.js";

export function YearMonthRenderer(root){

    var shadowRoot = root;

    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    this.resources=[];
    this.jobs = [];

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var monthSelectFrom;
    var yearSelectFrom;
    var monthSelectTo;
    var yearSelectTo;

    this.selectedJob = null;
    this.selectedJobElement = null;

    var getYearFrom = function() {
      return parseInt(yearSelectFrom.value);
    }

    var setYearFrom = function(newValue) {
      yearSelectFrom.value = newValue;
    }

    var getYearTo = function() {
      return parseInt(yearSelectTo.value);
    }

    var setYearTo = function(newValue) {
      yearSelectTo.value = newValue;
    }

    var getMonthFrom = function() {
      return parseInt(monthSelectFrom.value);
    }

    var setMonthFrom = function(newValue) {
      monthSelectFrom.value = newValue;
    }

    var getMonthTo = function() {
      return parseInt(monthSelectTo.value);
    }

    var setMonthTo = function(newValue) {
      monthSelectTo.value = newValue;
    }
  
    var checkElements = function(){

      if(shadowRoot && yearSelectFrom && yearSelectTo && monthSelectFrom && monthSelectTo){
        return true;
      }
      return false;
    }

    this.clear = function(){

      if(checkElements()){
        yearSelectFrom.removeEventListener('change', initGantt);
        yearSelectFrom.remove();

        yearSelectTo.removeEventListener('change', initGantt);
        yearSelectTo.remove();

        monthSelectFrom.removeEventListener('change', initGantt);
        monthSelectFrom.remove();

        monthSelectTo.removeEventListener('change', initGantt);
        monthSelectTo.remove();

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
      
          <select id="from-select-year" name="from-select-year"></select>
          <select id="from-select-month" name="from-select-month">
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
          </select>
       
        `;

        shadowRoot.querySelector("#select-to").innerHTML += `
        
          <select id="to-select-year" name="to-select-year"></select>
          <select id="to-select-month" name="to-select-month">
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
          </select>
        `;

        for(var y=2000; y<=2100; y++){
          shadowRoot.querySelector("#from-select-year").innerHTML += `
          <option value="${y}">${y}</option>
          `;
          shadowRoot.querySelector("#to-select-year").innerHTML += `
          <option value="${y}">${y}</option>
          `;
        }

        monthSelectFrom = shadowRoot.querySelector('#from-select-month');
        yearSelectFrom =  shadowRoot.querySelector('#from-select-year');
        monthSelectTo = shadowRoot.querySelector('#to-select-month');
        yearSelectTo =  shadowRoot.querySelector('#to-select-year');

        yearSelectFrom.addEventListener('change', initGantt);
        monthSelectFrom.addEventListener('change', initGantt);   
        yearSelectTo.addEventListener('change', initGantt);
        monthSelectTo.addEventListener('change', initGantt);  
         
        setMonthFrom(this.dateFrom.getMonth());
        setYearFrom(this.dateFrom.getFullYear());
        setMonthTo(this.dateTo.getMonth());
        setYearTo(this.dateTo.getFullYear());
      }
     }.bind(this);

    var initFirstRow = function(){
      
      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);

        var resource = document.createElement("div");
        resource.className = "gantt-row-resource";
        container.appendChild(resource);
      
        var month = new Date(first_month);

        for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
            
          var period = document.createElement("div");
          period.className = "gantt-row-period";
          period.innerHTML = names[month.getMonth()] + " " + month.getFullYear();

          container.appendChild(period);
        }
      }
    }

    var initSecondRow = function(){

      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);

        var resource = document.createElement("div");
        resource.className = "gantt-row-resource";
        resource.style.borderTop = "none";    
        container.appendChild(resource);

        var month = new Date(first_month);

        for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
            
            var month_period = document.createElement("div");
            month_period.className = "gantt-row-period";
            month_period.style.border = "none";
            container.appendChild(month_period);

            var f_om = new Date(month);
            var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
          
            var date = new Date(f_om);

            for(date; date <= l_om; date.setDate(date.getDate()+1)){
                
              var period = document.createElement("div");
              period.className = "gantt-row-period";
              period.style.borderTop = "none";
              period.innerHTML = date.getDate();
              
              month_period.appendChild(period);
            } 
        }
      }
    }

    var initGanttRows = function(){
      
      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);

        this.resources.forEach(element => {

          var resource = document.createElement("div");
          resource.className = "gantt-row-resource";
          resource.style.borderTop = "none";    
          resource.innerHTML = element.name;
          container.appendChild(resource);

          var month = new Date(first_month);

          for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
              
              var month_period = document.createElement("div");
              month_period.className = "gantt-row-period";
              month_period.style.border = "none";
              container.appendChild(month_period);

              var f_om = new Date(month);
              var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
            
              var date = new Date(f_om);

              for(date; date <= l_om; date.setDate(date.getDate()+1)){
                  
                var period = document.createElement("div");
                period.className = "gantt-row-item";
                period.style.borderTop = "none";
                period.style.borderRight = "none";

                if(date.getDay()==0 || date.getDay()==6){
                  period.style.backgroundColor="whitesmoke";
                }

                period.setAttribute("data-date", formatDate(date));
                period.setAttribute("data-resource", element.id);

                period.ondrop = onJobDrop;

                period.ondragover = function(ev){
                  ev.preventDefault();
                }
              
                month_period.appendChild(period);
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
        end.setDate(start.getDate()+dayDiff(job.start, job.end));

        job.start = start;
        job.end = end;
        job.resource = gantt_item.getAttribute("data-resource");
        jobElement.update();
      }
    }.bind(this);


    var initGantt = function(){

      if(checkElements()){
      if( (getYearFrom() > getYearTo()) || (getYearFrom() == getYearTo() && getMonthFrom() > getMonthTo())){

        monthSelectFrom.style.color="red";
        monthSelectTo.style.color="red";

        yearSelectFrom.style.color="red";
        yearSelectTo.style.color="red";

      }else{

        monthSelectFrom.style.color="black";
        monthSelectTo.style.color="black";

        yearSelectFrom.style.color="black";
        yearSelectTo.style.color="black";

        var container = shadowRoot.querySelector("#gantt-container");
        container.innerHTML = "";

        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);
    
        var n_months = monthDiff(first_month, last_month)+1;
        container.style.gridTemplateColumns = `160px repeat(${n_months},1fr)`;

        initFirstRow();

        initSecondRow();

        initGanttRows();

        initJobs();
    }  
  }
  }

  var formatDate = function(d){

    return d.getFullYear()+"-"+zeroPad(d.getMonth()+1)+"-"+zeroPad(d.getDate());
    
  }

  var zeroPad = function(n){

    return n<10 ? "0"+n : n;

  }

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  function dayDiff(d1, d2){
    
    var diffTime = Math.abs(d2 - d1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }


  var getGanttElementFromPosition = function(x, y){

    var items = shadowRoot.elementsFromPoint(x, y);
    var gantt_item = items.find(item => item.classList.contains("gantt-row-item"));

    return gantt_item;
  }


  var initJobs = function(){

    if(checkElements()){

        this.jobs.forEach(job => {

            var date_string = formatDate(job.start);
            var ganttElement = shadowRoot.querySelector(`div[data-resource="${job.resource}"][data-date="${date_string}"]`);

            if(ganttElement){
    
              var jobElement = document.createElement("gantt-job");
              jobElement.id = job.id;
              jobElement.job = job;
              jobElement.level = "year-month";

              ganttElement.appendChild(jobElement);
            
              jobElement.ondragstart = function(ev){
                  ev.dataTransfer.setData("job", ev.target.id);           
              };

              jobElement.addEventListener("editjob", (ev) =>{

                var date_string = formatDate(job.start);
                var gantt_item = shadowRoot.querySelector(`div[data-resource="${job.resource}"][data-date="${date_string}"]`);
                gantt_item.appendChild(jobElement);
                
              });
            }
        });

        makeJobsResizable();
        makeJobsEditable();
      }
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